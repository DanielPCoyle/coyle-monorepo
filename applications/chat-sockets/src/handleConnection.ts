import { getDB, schema } from "@coyle/database";
import { addConversation } from "@coyle/web/util/addConversation";
import { eq } from 'drizzle-orm';
import { Server, Socket } from "socket.io";
import { addReaction } from "./addReaction.js";
import { chatMessage } from "./chatMessage.js";

const {conversations:convos, messages} = schema;

interface PersonOnSite {
  socketId: string;
  [key: string]: string | number | boolean;
}

export function handleConnection(
  socket: Socket,
  io: Server,
  conversations: any[],
  peopleOnSite: PersonOnSite[],
) {
  const db = getDB() as any;
  peopleOnSite.push({ socketId: socket.id });
  io.emit("peopleOnSite", peopleOnSite);
  let typingTimeout: NodeJS.Timeout;

  socket.on("login", ({ username, email, id }) => {
    conversations.push({ username, email, id, socketId: socket.id });
    io.emit("conversations", conversations);
    socket.join(id);
    addConversation({ name: username, email, conversation_key: id });
  });

  socket.on("join", ({ id }) => {
    socket.join(id);
    io.to(id).emit("update messages request", id);
  });

  socket.on("leave", ({ id }) => {
    socket.leave(id);
  });

  chatMessage({socket,io,conversations,convos, messages, db})

  addReaction({socket,io,messages,db});



  socket.on("update messages action", ({ id, messages }) => {
    io.to(id).emit("update messages result", { convoId: id, messages });
  });

  socket.on("user typing", ({ conversationId, username }) => {
    io.to(conversationId).emit("user typing", { username });
    if (typingTimeout) clearTimeout(typingTimeout);

    typingTimeout = setTimeout(() => {
      io.to(conversationId).emit("user not typing", { username });
    }, 1000);
  });

  socket.on("seen", async (messageId: string) => {
    try{
      await db
        .update(messages)
        .set({ seen: true })
        .where(eq(messages.id, Number(messageId)));
  
      io.emit("conversations", conversations); // Update clients
    } catch (error) {
      console.log("ERROR UPDATING SEEN RECORD",{ error });
    }
  });

  socket.on("mouseMoveUpdatePeopleOnSite", ({ data, socketId }) => {
    const personIndex = peopleOnSite
      .filter((person) => person.socketId)
      .findIndex((person) => person.socketId === socketId);
    if (personIndex > 0) {
      peopleOnSite[personIndex] = { ...data, socketId };
      io.emit("peopleOnSite", peopleOnSite);
    }
  });

  

  socket.on("file added", async (props) => {
    io.to(props.conversationId).emit("file added", props);
  });

  socket.on("disconnect", () => {
    const userIndex = peopleOnSite.findIndex(
      (user) => user?.socketId === socket.id,
    );
    if (userIndex) {
      delete peopleOnSite[userIndex];
    }
    const conversationIndex = conversations.findIndex(
      (user) => user?.socketId === socket.id,
    );
    if (conversationIndex) {
      delete conversations[conversationIndex];
      io.emit("conversations", conversations); // Update clients
    }
  });
}


export default handleConnection;


