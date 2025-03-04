import { getDB } from "@coyle/database";
import { conversations, messages } from "@coyle/database/schema";
import { eq } from "drizzle-orm";

interface Message {
  id: number;
  conversationId: number;
  parentId: number | null;
  replies?: Message[];
}
export async function getMessages(conversationKey: string): Promise<Message[]> {
  const db = getDB();

  try {
    const data = await db
      .select()
      .from(conversations)
      .where(eq(conversations.conversationKey, conversationKey));
    if (data.length === 0) {
      return [];
    }
    const conversationId = data[0].id;
    const messageData: Message[] = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId));

    console.log({ conversationId, messageData });
    for (const message of messageData) {
      const replies = await db
        .select()
        .from(messages)
        .where(eq(messages.parentId, message.id));
      message.replies = replies || [];
    }

    return messageData;
  } catch (error) {
    console.error(error);
    return [];
  }
}
