import { getDB } from "@simpler-development/chat-db";
import { messages } from "@simpler-development/chat-db/schema";
export const insertMessage = async (insert) => {
  const db = getDB();
  const [data] = await db.insert(messages).values(insert).returning().execute();
  return data;
};
