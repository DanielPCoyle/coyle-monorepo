export const userTyping = ({ socket, io, typingTimeout }) =>
  socket.on("user typing", ({ conversationKey, userName }) => {
    console.log("user typing", userName);
    io.to(conversationKey).emit("user typing", { name: userName });
    if (typingTimeout) clearTimeout(typingTimeout);

    typingTimeout = setTimeout(() => {
      io.to(conversationKey).emit("user not typing", { userName });
    }, 1000);
  });
