export const translation = ({ socket, io }) =>
  socket.on("translation", ({conversationKey, id, data}) => {
    socket.to(conversationKey).emit("translation", {
        conversationKey,
        id,
        data,
    })
  });
