import { getDB } from '@coyle/database/db';
import { conversations } from '@coyle/database/schema';
import dotenv from "dotenv";
import { NextApiRequest, NextApiResponse } from "next";

dotenv.config();


interface Conversation {
  id: number;
  conversation_key: string;
  name: string;
  email: string;
  created_at: Date;
  unSeenMessages?: number;
}

async function getConversations(): Promise<Conversation[]> {
  const db = getDB();
  const data: Conversation[] = await db.select().from(conversations);
  return data;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const conversations = await getConversations();
  res.status(200).json(conversations);
}
