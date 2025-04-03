import {
  updateConversationIsActive,
  getConversations,
  getConversationBySocketId,
  getUsersOnline,
} from "@simpler-development/chat-db";

export const disconnect = ({ socket, io }) =>
  socket.on("disconnect", async () => {
    try {
      const conversation = await getConversationBySocketId(socket.id);
      if (conversation) {
        await updateConversationIsActive(conversation.conversationKey, false);
        const allConversations = await getConversations();
        io.emit("conversations", allConversations);

        const onlineUsers = await getUsersOnline();
        io.emit("adminsOnline", onlineUsers);
      }
    } catch (error) {
      console.error("Error disconnecting", error);
    }
  });
