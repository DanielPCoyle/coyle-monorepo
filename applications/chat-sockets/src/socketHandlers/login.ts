import {
  addConversation,
  getConversations,
  getConversationIdByKey,
  updateConversationIsActive,
  updateConversationSocketId,
} from "@coyle/chat-db";

export const login = ({ socket, io }) =>
  socket.on("login", async ({ userName, email, id, isAdmin }) => {
    socket.join(id);

    const existingConversationId = await getConversationIdByKey(id);
    if (existingConversationId) {
      await updateConversationIsActive(id, true);
      await updateConversationSocketId(existingConversationId, socket.id);
    } else {
      await addConversation({
        name: userName,
        email,
        conversationKey: id,
        isAdmin,
        isActive: true,
      });
    }
    const allConversations = await getConversations();
    io.emit("conversations", allConversations);
  });
