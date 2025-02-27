import dotenv from "dotenv";
import { eq } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../database/db";
import { conversations, messages } from "../../database/schema";
dotenv.config();


interface Message {
  id: number;
  conversation_id: number;
  parent_id: number | null;
  replies?: Message[];
  // ...other message fields...
}

async function getMessages(conversation_key: string): Promise<Message[]> {
  const db = getDB();
  
  try{

  const data = await db.select()
  .from(conversations)
  .where(eq(conversations.conversation_key, conversation_key));
  if (data.length === 0) {
    return [];
  } 
  const conversationId = data[0].id;
  const messageData: Message[] = await db.select()
    .from(messages)
    .where(eq(messages.conversation_id, conversationId));

  for (const message of messageData) {
    const replies = await  db.select()
    .from(messages)
    .where(eq(messages.parent_id, message.id))
    message.replies = replies;
  }

  return messageData;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { conversation_key } = req.query;
  const messages = await getMessages(conversation_key as string);
  res.status(200).json(messages);
}
