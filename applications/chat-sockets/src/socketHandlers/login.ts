import { addConversation, getConversations, getConversationIdByKey, updateConversationIsActive  } from "@coyle/database";

export const login = ({ socket, io, conversations }) =>
  socket.on("login", async ({ userName, email, id, isAdmin }) => {
    conversations.push({ user: userName, email, id, socketId: socket.id });
    socket.join(id);

    const existingConversation = await getConversationIdByKey(id);
    if (existingConversation) {
      await updateConversationIsActive(id, true);
    } else{
      await addConversation({ name: userName, email, conversationKey: id, isAdmin, isActive:true });
    }
    const allConversations = await getConversations();
    io.emit("conversations", allConversations);
  });
