import { eq } from "drizzle-orm";
import { messages } from "../../../schema";
import { getDB } from "../../db";

export const addReactionToMessage = async ({ reactions, messageId }) => {
  const db = getDB();
  await db
    .update(messages)
    .set({ reactions: reactions })
    .where(eq(messages.id, messageId));
};
