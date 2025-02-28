import { getDB } from "@coyle/database/db";
import { conversations, messages } from "@coyle/database/schema";
import dotenv from "dotenv";
import { eq } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";

dotenv.config();


interface Message {
  id: number;
  conversationId: number;
  parentId: number | null;
  replies?: Message[];
  // ...other message fields...
}

async function getMessages(conversationKey: string): Promise<Message[]> {
  const db = getDB();
  
  try{

  const data = await db.select()
  .from(conversations)
  .where(eq(conversations.conversationKey, conversationKey));
  if (data.length === 0) {
    return [];
  } 
  const conversationId = data[0].id;
  const messageData: Message[] = await db.select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId));

  for (const message of messageData) {
    const replies = await  db.select()
    .from(messages)
    .where(eq(messages.parentId, message.id))
    message.replies = replies;
  }

  return messageData;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { conversationKey } = req.query;
  const messages = await getMessages(conversationKey as string);
  res.status(200).json(messages);
}
