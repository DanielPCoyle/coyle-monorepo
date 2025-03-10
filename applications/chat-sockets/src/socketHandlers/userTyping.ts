export const userTyping = ({ socket, io, typingTimeout }) =>
  socket.on("user typing", ({ conversationId, user }) => {
    io.to(conversationId).emit("user typing", { user });
    if (typingTimeout) clearTimeout(typingTimeout);

    typingTimeout = setTimeout(() => {
      io.to(conversationId).emit("user not typing", { user });
    }, 1000);
  });
