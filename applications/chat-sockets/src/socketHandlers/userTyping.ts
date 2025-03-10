export const userTyping = ({ socket, io, typingTimeout }) =>
  socket.on("user typing", ({ conversationId, userName }) => {
    io.to(conversationId).emit("user typing", { name: userName });
    if (typingTimeout) clearTimeout(typingTimeout);

    typingTimeout = setTimeout(() => {
      io.to(conversationId).emit("user not typing", { userName });
    }, 1000);
  });
