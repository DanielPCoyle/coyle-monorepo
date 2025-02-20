import { Server } from "socket.io";
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);


async function addConversation({name,email, conversation_key}) {
    const { data: existingData, error: existingError } = await supabase
      .from('conversations')
      .select('*')
      .eq('conversation_key', conversation_key);

    if (existingError) {
        console.error(existingError);
        return;
    }

    if (existingData.length > 0) {
        return;
    }

    const { data, error } = await supabase
      .from('conversations')
      .insert([{ name, email, conversation_key }]);
  
    if (error) console.error(error);
    else console.log('Inserted:', data);
}

async function addMessage({ sender, message, conversation_key }) {
    // Fetch the conversation ID
    const { data, error } = await supabase
        .from('conversations')
        .select('id')
        .eq('conversation_key', conversation_key)
        .single(); // Ensures we get only one result

    if (error) {
        return null;
    }

    const conversationId = data.id;

    // Insert message and return the newly inserted record
    const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .insert([{ conversation_id: conversationId, message, sender }])
        .select(); // 👈 This ensures the response includes the inserted row(s)

    if (messageError) {
        return null;
    }

    return messageData[0].id; // Return the inserted message with its ID
}


let conversations = [];
let peopleOnSite = [];
export default function handler(req, res) {
  
    if (!res.socket.server.io) {

        const io = new Server(res.socket.server, {
            path: "/api/socket",
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
        });

        io.on("connection", (socket) => {
            peopleOnSite.push({socketId:socket.id});
            io.emit("peopleOnSite", peopleOnSite);
            let typingTimeout;
            console.log("User connected", socket.id);

            socket.on("login", ({ username, email, id }) => {
                conversations.push({ username, email, id, socketId:socket.id });
                io.emit("conversations", conversations);
                socket.join(id);
                addConversation({name:username,email,conversation_key:id});
            });

            socket.on("join", ({ id }) => {
                socket.join(id);
                io.to(id).emit("update messages request",id);
            });

            socket.on("leave", ({ id }) => {
                socket.leave(id);
            })

            socket.on("update messages action", ({ id, messages }) => {
                io.to(id).emit("update messages result", { convoId:id, messages });
            });

            socket.on("user typing", ({ conversationId, username }) => {
                io.to(conversationId).emit("user typing", { username });
                console.log("User typing", username);   
                if (typingTimeout) clearTimeout(typingTimeout);

                typingTimeout = setTimeout(() => {
                    io.to(conversationId).emit("user not typing", { username });
                }, 1000);
            });

            socket.on("seen", async (messageId) => {
                // update message as seen in the database
                const { data, error } = await supabase
                    .from('messages')
                    .update({ seen: true })
                    .eq('id', messageId);
                    io.emit("conversations", conversations); // Update clients

                if (error) {
                    console.error('Error updating message as seen:', error);
                } else {
                    console.log('Message marked as seen:', messageId);
                }
                
            });

            socket.on("mouseMoveUpdatePeopleOnSite", ({data,socketId}) => {
                const personIndex = peopleOnSite
                .filter(person => person.socketId)
                .findIndex(person => person.socketId === socketId);
                if (personIndex > 0) {
                    peopleOnSite[personIndex] = {...data,
                        socketId
                    };
                    io.emit("peopleOnSite", peopleOnSite);
                }
            });


            socket.on("chat message", async ({ id, message, sender }) => {
                const recipient = conversations.find(convo => convo?.socketId === socket.id);
                if (recipient) {
                    const messageId = await addMessage({sender, message, conversation_key:id});
                    io.to(id).emit("chat message", { id, sender, message, id:messageId });
                }

                io.emit("conversations", conversations); // Update clients
            });


            socket.on("file added", async (props) => {
                io.to(props.conversationId).emit("file added", props);
            });


            socket.on("disconnect", () => {
                console.log("User disconnected", socket.id);
                console.log("People on site", peopleOnSite);
                const userIndex = peopleOnSite.findIndex(user => user?.socketId === socket.id);
                console.log("User index", userIndex);
                if (userIndex) {
                    delete peopleOnSite[userIndex];
                }
                const conversationIndex = conversations.findIndex(user => user?.socketId === socket.id);
                if (conversationIndex) {
                    delete conversations[conversationIndex];
                    io.emit("conversations", conversations); // Update clients
                }
            });
        });

        res.socket.server.io = io; // Store in server object
    }

    res.end();
}
