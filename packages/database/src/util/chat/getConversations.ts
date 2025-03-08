import { getDB } from "@coyle/database";
import { conversations } from "@coyle/database/schema";

interface Conversation {
  id: number;
  conversationKey: string;
  name: string;
  email: string;
  createdAt: Date;
  unSeenMessages?: number;
}
export async function getConversations(): Promise<Conversation[]> {
  const db = getDB();
  const data: Conversation[] = await db.select().from(conversations);
  return data;
}
