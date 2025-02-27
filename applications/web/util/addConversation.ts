import { eq } from 'drizzle-orm';
import { getDB } from '../../../packages/database/db';
import { conversations } from '../../../packages/database/schema';

interface AddConversationParams {
  name: string;
  email: string;
  conversation_key: string;
}

export async function addConversation({
  name,
  email,
  conversation_key,
}: AddConversationParams): Promise<void> {
  const db = getDB();
  const existingData = await db.select().from(conversations).where(eq(conversations.conversation_key, conversation_key));
  if (existingData.length > 0) {
    return;
  }
  await db.insert(conversations).values({ name, email, conversation_key });
}
