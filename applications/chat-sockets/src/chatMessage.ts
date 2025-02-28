import { eq } from "drizzle-orm";

export const chatMessage = ({ socket, io, conversations, convos, messages, db }) => socket.on("chat message", async ({ id, message, sender, files, replyId }) => {
  try {

    const conversation = await db.select()
      .from(convos)
      .where(eq(convos.conversation_key, id));
    const conversationId = conversation[0].id;

    const formattedMessage = message.replace(/\n/g, "<br/>");
    const insert = {
      sender,
      message: formattedMessage,
      conversation_id: conversationId,
      parent_id: replyId,
      files,
      seen: false,
    };
    const data = await db
      .insert(messages)
      .values(insert).returning()
      .execute();


    io.to(id).emit("chat message", {
      sender,
      message: formattedMessage,
      id: data.id,
      parentId: replyId,
      files,
    });

    io.emit("conversations", conversations); // Update clients
  } catch (error) {
    console.log({ error });
  }
});
