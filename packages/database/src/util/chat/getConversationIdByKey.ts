import { getDB } from "@coyle/database";
import { conversations as convos } from "@coyle/database/schema";
import { eq } from "drizzle-orm";
export const getConversationIdByKey = async (key) => {
  const db = getDB() as any;
  const conversation = await db.select()
    .from(convos)
    .where(eq(convos.conversationKey, key));
  const conversationId = conversation[0].id;
  return conversationId;
};
