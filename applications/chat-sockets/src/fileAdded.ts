export const fileAdded = ({ socket, io }) => socket.on("file added", async (props) => {
  io.to(props.conversationId).emit("file added", props);
});
