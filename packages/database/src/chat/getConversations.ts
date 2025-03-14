import { getDB } from "@coyle/database";
import { conversations, messages } from "@coyle/database/schema";
import { eq, count, and } from "drizzle-orm";

interface Conversation {
  id: number;
  conversationKey: string;
  name: string;
  email: string;
  createdAt: Date;
  unSeenMessages: number;
}

export async function getConversations(): Promise<Conversation[]> {
  const db = getDB();

  const data = await db
    .select({
      id: conversations.id,
      conversationKey: conversations.conversationKey,
      name: conversations.name,
      email: conversations.email,
      createdAt: conversations.createdAt,
      isActive: conversations.isActive,
      unSeenMessages: count(messages.id).as("unSeenMessages"),
    })
    .from(conversations)
    .leftJoin(
      messages,
      and(
        eq(messages.conversationId, conversations.id),
        eq(messages.seen, false),
      ),
    )
    .groupBy(conversations.id);

  return data;
}
