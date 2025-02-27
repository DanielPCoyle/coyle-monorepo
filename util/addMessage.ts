import { eq } from 'drizzle-orm';
import { getDB } from "../database/db";
import { conversations, messages } from "../database/schema";

interface AddMessageParams {
  sender: string;
  message: string;
  parent_id: number | null;
  conversation_key: string;
  files: File[];
}

export async function addMessage({
  sender,
  message,
  conversation_key,
  parent_id,
  files,
}: AddMessageParams): Promise<number | null> {
  const db = getDB();
  // Fetch the conversation ID
  const data = await db.select()
    .from(conversations)
    .where(eq(conversations.conversation_key, conversation_key))

  const conversationId = data[0].id;

  // Insert message and return the newly inserted record
  try{

    const messageData = await db
    .insert(messages)
    .values({ conversation_id: conversationId, message, sender, files, parent_id, seen: false });
    console.log({messageData});
    return messageData.id; // Return the inserted message with its ID
  } catch (error) {
    console.error(error);
    return null;
  }
}
