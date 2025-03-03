import { getDB } from "@coyle/database";
import { eq } from "drizzle-orm";
import { messages } from "../../../schema";

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
