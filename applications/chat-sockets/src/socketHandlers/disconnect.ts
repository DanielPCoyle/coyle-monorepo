export const disconnect = ({ socket, io, peopleOnSite, conversations }) =>
  socket.on("disconnect", () => {
    const userIndex = peopleOnSite.findIndex(
      (user) => user?.socketId === socket.id,
    );
    if (userIndex >= 0) {
      delete peopleOnSite[userIndex];
    }
    const conversationIndex = conversations.findIndex(
      (user) => user?.socketId === socket.id,
    );
    if (conversationIndex >= 0) {
      const conversation = conversations[conversationIndex];
      const newConversations = conversations.filter(
        (user) => user?.id !== conversation.id,
      );
      console.log({newConversations})
      io.emit("conversations", newConversations); 
    }
  });
