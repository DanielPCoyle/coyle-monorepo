import {
  getConversationIdByKey,
  insertMessage,
  getConversations,
  addConversation,
} from "@coyle/chat-db";

export const chatMessage = ({ socket, io }) =>
  socket.on("chat message", async ({ id, message, sender, files, replyId, language }) => {
    try {
      let conversationId = await getConversationIdByKey(id);
      if (!conversationId) {
        // add conversation
        const addConvo = await addConversation({
          name: sender,
          email: "",
          conversationKey: id,
          isAdmin: false,
          isActive: true,
        });
        if (addConvo) {
          conversationId = addConvo.id;
        }
      }
      const formattedMessage = message.replace(/\n/g, "<br/>");

      const insert = {
        sender,
        message: formattedMessage,
        conversationId: conversationId,
        parentId: replyId,
        files,
        seen: false,
        language
      };

      const data = await insertMessage(insert);

      io.to(id).emit("chat message", {
        sender,
        message: formattedMessage,
        id: data.id,
        parentId: replyId,
        files,
        language
      });

      const conversations = await getConversations();
      io.emit("conversations", conversations);
    } catch (error) {
      console.log({ error });
    }
  });
