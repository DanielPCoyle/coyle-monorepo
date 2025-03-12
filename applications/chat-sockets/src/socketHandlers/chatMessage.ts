import {
  getConversationIdByKey,
  insertMessage,
  getConversations,
} from "@coyle/database";

export const chatMessage = ({ socket, io }) =>
  socket.on("chat message", async ({ id, message, sender, files, replyId }) => {
    try {
      const conversationId = await getConversationIdByKey(id);
      const formattedMessage = message.replace(/\n/g, "<br/>");

      const insert = {
        sender,
        message: formattedMessage,
        conversationId: conversationId,
        parentId: replyId,
        files,
        seen: false,
      };

      const data = await insertMessage(insert);

      io.to(id).emit("chat message", {
        sender,
        message: formattedMessage,
        id: data.id,
        parentId: replyId,
        files,
      });

      const conversations = await getConversations();
      io.emit("conversations", conversations);
    } catch (error) {
      console.log({ error });
    }
  });
