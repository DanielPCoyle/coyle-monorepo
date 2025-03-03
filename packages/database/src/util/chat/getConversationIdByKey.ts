import { eq } from "drizzle-orm";
import { conversations as convos } from "../../../schema";
import { getDB } from "../../db";
export const getConversationIdByKey = async (key) => {
  const db = getDB() as any;
  const conversation = await db.select()
    .from(convos)
    .where(eq(convos.conversationKey, key));
  const conversationId = conversation[0].id;
  return conversationId;
};
