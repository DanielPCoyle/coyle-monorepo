export const leave = ({ socket }) =>
  socket.on("leave", ({ id }) => {
    socket.leave(id);
  });
