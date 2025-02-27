import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { eq } from "drizzle-orm";
import { getDB } from "../../database/db";
import { conversations, messages } from "../../database/schema";
dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

async function getMessages(conversation_key) {
  const db = getDB();
  
  try{

  const data = await db.select()
  .from(conversations)
  .where(eq(conversations.conversation_key, conversation_key));
  if (data.length === 0) {
    return [];
  } 
  const conversationId = data[0].id;
  const messageData = await db.select()
    .from(messages)
    .where(eq(messages.conversation_id, conversationId));

  for (const message of messageData) {
    const { data: replies, error: repliesError } = await  db.select()
    .from(messages)
    .where(eq(messages.parent_id, message.id))
    if (repliesError) {
      message.replies = [];
    } else {
      message.replies = replies;
    }
  }

  return messageData;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function handler(req, res) {
  const { conversation_key } = req.query;
  const messages = await getMessages(conversation_key);
  res.status(200).json(messages);
}
