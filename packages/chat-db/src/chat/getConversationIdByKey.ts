import { getDB } from "@simpler-development/chat-db";
import { conversations as convos } from "@simpler-development/chat-db/schema";
import { AdminDb } from "@simpler-development/chat-db/src/db";
import { eq } from "drizzle-orm";
export const getConversationIdByKey = async (key) => {
  try {
    const db = getDB() as AdminDb;
    const conversation = await db
      .select()
      .from(convos)
      .where(eq(convos.conversationKey, key));
    if (!conversation[0]) return false;
    const conversationId = conversation[0]?.id;
    return conversationId;
  } catch (error) {
    console.log("Error getting conversation id by key", error);
    return false;
  }
};
