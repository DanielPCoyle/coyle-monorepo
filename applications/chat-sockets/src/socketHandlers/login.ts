import { addConversation } from "@coyle/database";
export const login = ({ socket, io, conversations }) =>
  socket.on("login", ({ user, email, id }) => {
    conversations.push({ user, email, id, socketId: socket.id });
    io.emit("conversations", conversations);
    socket.join(id);
    addConversation({ name: user, email, conversationKey: id });
  });
