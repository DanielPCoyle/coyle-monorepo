export const updateMessageAction = ({ socket, io }) => socket.on("update messages action", ({ id, messages }) => {
  io.to(id).emit("update messages result", { convoId: id, messages });
});
