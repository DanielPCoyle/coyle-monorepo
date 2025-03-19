import { getDB } from "../..";
import { conversations } from "../../schema";
import type { Conversation } from "../../schema";
import { eq } from "drizzle-orm";

export async function updateConversationIsActive(
  conversationKey,
  status,
): Promise<void> {
  try {
    const db = getDB();
    await db
      .update(conversations)
      .set({ isActive: status } as Conversation)
      .where(eq(conversations.conversationKey, conversationKey));
  } catch (error) {
    console.error("Error adding conversation", error);
  }
}

export default updateConversationIsActive;
