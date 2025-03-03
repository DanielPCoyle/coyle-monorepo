export const userTyping = ({ socket, io, typingTimeout }) => socket.on("user typing", ({ conversationId, username }) => {
  io.to(conversationId).emit("user typing", { username });
  if (typingTimeout) clearTimeout(typingTimeout);

  typingTimeout = setTimeout(() => {
    io.to(conversationId).emit("user not typing", { username });
  }, 1000);
});
