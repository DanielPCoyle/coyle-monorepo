import { addConversation } from "@coyle/database";
export const login = ({ socket, io, conversations }) =>
  socket.on("login", ({ username, email, id }) => {
    conversations.push({ username, email, id, socketId: socket.id });
    io.emit("conversations", conversations);
    socket.join(id);
    addConversation({ name: username, email, conversationKey: id });
  });
