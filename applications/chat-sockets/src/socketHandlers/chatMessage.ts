import { getConversationIdByKey, insertMessage } from "@coyle/database";

export const chatMessage = ({ socket, io }) =>
  socket.on(
    "chat message",
    async ({ id, message, sender, files, replyId }) => {
      try {
        console.log("CHAT MESSAGE", { id });
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

        console.log("ID>>>>>", { id });
        io.to(id).emit("chat message", {
          sender,
          message: formattedMessage,
          id: data.id,
          parentId: replyId,
          files,
        });
      } catch (error) {
        console.log({ error });
      }
    },
  );
