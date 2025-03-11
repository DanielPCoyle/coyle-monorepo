import { addConversation } from "@coyle/database";
export const login = ({ socket, io, conversations }) =>
  socket.on("login", ({ userName, email, id, isAdmin }) => {
    conversations.push({ user: userName, email, id, socketId: socket.id });
    io.emit("conversations", conversations);
    socket.join(id);
    addConversation({ name: userName, email, conversationKey: id, isAdmin });
  });
