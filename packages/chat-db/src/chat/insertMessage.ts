import { getDB } from "@coyle/chat-db";
import { messages } from "@coyle/chat-db/schema";
export const insertMessage = async (insert) => {
  const db = getDB();
  const [data] = await db.insert(messages).values(insert).returning().execute();
  return data;
};
