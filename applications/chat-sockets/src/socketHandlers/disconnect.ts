import { updateConversationIsActive, getConversations } from "@coyle/database";

export const disconnect = ({ socket, io, conversations }) =>
  socket.on("disconnect", async () => {
    const conversation = conversations.find((c) => c.socketId === socket.id);
    if (conversation) {
      await updateConversationIsActive(conversation.id, false);
      const allConversations = await getConversations();
      io.emit("conversations", allConversations);
    }
  });
