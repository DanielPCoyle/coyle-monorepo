export const disconnect = ({ socket, io, peopleOnSite, conversations }) =>
  socket.on("disconnect", () => {
    const userIndex = peopleOnSite.findIndex(
      (user) => user?.socketId === socket.id,
    );
    if (userIndex) {
      delete peopleOnSite[userIndex];
    }
    const conversationIndex = conversations.findIndex(
      (user) => user?.socketId === socket.id,
    );
    if (conversationIndex) {
      delete conversations[conversationIndex];
      io.emit("conversations", conversations); // Update clients
    }
  });
