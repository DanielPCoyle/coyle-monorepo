import { eq } from "drizzle-orm";

export const seen = ({ socket, io, messages,db,conversations}) => socket.on("seen", async (messageId: string) => {
  try {
    await db
      .update(messages)
      .set({ seen: true })
      .where(eq(messages.id, Number(messageId)));

    io.emit("conversations", conversations); // Update clients
  } catch (error) {
    console.log("ERROR UPDATING SEEN RECORD", { error });
  }
});
