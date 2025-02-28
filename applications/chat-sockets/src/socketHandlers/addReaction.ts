import { eq } from "drizzle-orm";

export const addReaction = ({ socket, io, messages, db }) => socket.on("addReaction", async ({ id, messageId, reactions }) => {
  try {
    await db
      .update(messages)
      .set({ reactions: reactions })
      .where(eq(messages.id, messageId));

    io.to(id).emit("addReaction", { messageId, reaction: reactions });
  } catch (error) {
    console.log("ERROR ADDING REACTION", { error });
  }
});
