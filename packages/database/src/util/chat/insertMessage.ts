import { getDB } from "@coyle/database";
import { messages } from "@coyle/database/schema";
export const insertMessage = async (insert) => {
  const db = getDB();
  const [data] = await db.insert(messages).values(insert).returning().execute();
  return data;
};
