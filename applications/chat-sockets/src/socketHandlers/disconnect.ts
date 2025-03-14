import {
  updateConversationIsActive,
  getConversations,
  getConversationBySocketId,
} from "@coyle/chat-db";

export const disconnect = ({ socket, io }) =>
  socket.on("disconnect", async () => {
    try {
      const conversation = await getConversationBySocketId(socket.id);
      if (conversation) {
        await updateConversationIsActive(conversation.conversationKey, false);
        const allConversations = await getConversations();
        io.emit("conversations", allConversations);
      }
    } catch (error) {
      console.error("Error disconnecting", error);
    }
  });
