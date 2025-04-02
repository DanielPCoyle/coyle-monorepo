export const join = ({ socket, io }) =>
  socket.on("join", ({ id }) => {
    socket.join(id);
    io.to(id).emit("update messages request", id);
  });
