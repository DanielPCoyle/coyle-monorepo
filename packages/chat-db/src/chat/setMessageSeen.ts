import { getDB } from "@coyle/chat-db";
import { messages } from "@coyle/chat-db/schema";
import { eq } from "drizzle-orm";

export const setMessageSeen = async (messageId: number) => {
  try {
    const db = getDB();
    await db
      .update(messages)
      .set({ seen: true })
      .where(eq(messages.id, Number(messageId)));
  } catch (error) {
    console.log("ERROR UPDATING SEEN RECORD", error);
  }
};
