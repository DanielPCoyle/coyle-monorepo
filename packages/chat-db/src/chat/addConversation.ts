import { getDB } from "../..";
import { conversations } from "../../schema";
import type { Conversation } from "../../schema";
import { eq } from "drizzle-orm";

interface AddConversationParams {
  name: string;
  email: string;
  conversationKey: string;
  isAdmin: boolean;
  isActive: boolean;
}

export async function addConversation({
  name,
  email,
  conversationKey,
}: AddConversationParams): Promise<Conversation> {
  try {
    const db = getDB();
    const existingData = await db
      .select()
      .from(conversations)
      .where(eq(conversations.conversationKey, conversationKey));
    if (existingData.length > 0) {
      return;
    }
    const [newConversation] = await db
      .insert(conversations)
      .values({ name, email, conversationKey })
      .returning();
    return newConversation;
  } catch (error) {
    console.error("Error adding conversation", error);
  }
}

export default addConversation;
