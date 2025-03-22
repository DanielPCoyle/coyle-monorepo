import { getDB } from "../..";
import { conversations } from "../../schema";
import type { Conversation } from "../../schema";
import { eq } from "drizzle-orm";

export async function updateConversationByKey(key,data): Promise<void> {
  try {
    const db = getDB();
    await db
      .update(conversations)
      .set(data as Conversation)
      .where(eq(conversations.conversationKey, key));
  } catch (error) {
    console.error("Error updating conversation", error);
  }
}

export default updateConversationByKey;
