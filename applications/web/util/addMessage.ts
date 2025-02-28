import { getDB } from "@coyle/database/db";
import { conversations, messages } from "@coyle/database/schema";
import { eq } from 'drizzle-orm';

interface AddMessageParams {
  sender: string;
  message: string;
  parent_id: number | null;
  conversation_key: string;
}

export async function addMessage({
  sender,
  message,
  conversation_key,
  parent_id,
}: AddMessageParams): Promise<number | null> {
  try{
  const db = getDB();
  const data = await db.select()
    .from(conversations)
    .where(eq(conversations.conversation_key, conversation_key))

    const conversationId = data[0].id;
    const messageData = await db
    .insert(messages)
    .values({ 
      conversation_id: conversationId,
      message,
      sender,
      parent_id,
      seen: false
     });
    
    return messageData.id; 
  } catch (error) {
    console.error(error);
    return null;
  }
}
