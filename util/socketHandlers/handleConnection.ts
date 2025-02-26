import { addConversation } from "../../pages/api/addConversation";
import { addMessage } from "../../pages/api/addMessage";
import { supabase } from "../../pages/api/socket";
import { Server, Socket } from "socket.io";

interface Conversation {
    username: string;
    email: string;
    id: string;
    socketId: string;
}

interface PersonOnSite {
    socketId: string;
    [key: string]: any;
}

export function handleConnection(socket: Socket, io: Server, conversations: Conversation[], peopleOnSite: PersonOnSite[]) {
    peopleOnSite.push({ socketId: socket.id });
    io.emit("peopleOnSite", peopleOnSite);
    let typingTimeout: NodeJS.Timeout;
    console.log("User connected", socket.id);

    socket.on("login", ({ username, email, id }) => {
        conversations.push({ username, email, id, socketId: socket.id });
        io.emit("conversations", conversations);
        socket.join(id);
        addConversation({ name: username, email, conversation_key: id });
    });

    socket.on("join", ({ id }) => {
        socket.join(id);
        console.log("JOIN", id);
        io.to(id).emit("update messages request", id);
    });

    socket.on("leave", ({ id }) => {
        socket.leave(id);
    });

    socket.on("addReaction", async ({ id, messageId, reactions }) => {
        const { data, error } = await supabase
            .from('messages')
            .update({ reaction: reactions })
            .eq('id', messageId);
        console.log("Add reaction", id, messageId, reactions);
        io.to(id).emit("addReaction", { messageId, reactions });

        if (error) {
            console.error('Error updating message as seen:', error);
        } else {
            console.log('Message marked as seen:', messageId);
        }
    });

    socket.on("update messages action", ({ id, messages }) => {
        io.to(id).emit("update messages result", { convoId: id, messages });
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

    socket.on("mouseMoveUpdatePeopleOnSite", ({ data, socketId }) => {
        const personIndex = peopleOnSite
            .filter(person => person.socketId)
            .findIndex(person => person.socketId === socketId);
        if (personIndex > 0) {
            peopleOnSite[personIndex] = { ...data, socketId };
            io.emit("peopleOnSite", peopleOnSite);
        }
    });

    socket.on("chat message", async ({ id, message, sender, files }) => {
        const recipient = conversations.find(convo => convo?.socketId === socket.id);
        if (recipient) {
            const formattedMessage = message.replace(/\n/g, '<br/>'); // Apply formatting
            const messageId = await addMessage({ sender, message: formattedMessage, conversation_key: id, files });
            io.to(id).emit("chat message", { id, sender, message: formattedMessage, id: messageId, files });
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
}