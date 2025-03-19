import { getDB } from "@coyle/chat-db";
import { conversations as convos } from "@coyle/chat-db/schema";
import { AdminDb } from "@coyle/chat-db/src/db";
import { eq } from "drizzle-orm";

export const getConversationBySocketId = async (socketId) => {
  try {
    const db = getDB() as AdminDb;
    const conversation = await db
      .select()
      .from(convos)
      .where(eq(convos.socketId, socketId));

    return conversation[0];
  } catch (error) {
    console.log("Error getting conversation id by key", error);
    return false;
  }
};
