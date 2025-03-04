import { getDB } from "@coyle/database";
import { messages } from "@coyle/database/schema";
import { eq } from "drizzle-orm";

export const addReactionToMessage = async ({ reactions, messageId }) => {
  const db = getDB();
  await db
    .update(messages)
    // eslint-disable-next-line
    .set({ reactions: reactions })
    .where(eq(messages.id, messageId));
};
