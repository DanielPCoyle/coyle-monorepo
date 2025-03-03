import { eq } from 'drizzle-orm';
import { conversations } from '../../../schema';
import { getDB } from '../../db';

interface AddConversationParams {
  name: string;
  email: string;
  conversationKey: string;
}

export async function addConversation({
  name,
  email,
  conversationKey,
}: AddConversationParams): Promise<void> {
  const db = getDB();
  const existingData = await db.select().from(conversations).where(eq(conversations.conversationKey, conversationKey));
  if (existingData.length > 0) {
    return;
  }
  await db.insert(conversations).values({ name, email, conversationKey });
}

export default addConversation;