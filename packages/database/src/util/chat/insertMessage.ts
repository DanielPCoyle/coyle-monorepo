import { messages } from "../../../schema";
import { getDB } from "../../db";
export const insertMessage = async (insert) => {
  const db = getDB();
  const [data] = await db
    .insert(messages)
    .values(insert).returning()
    .execute();
  return data;
};
