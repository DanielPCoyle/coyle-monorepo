import { getDB } from "@coyle/database";
import { messages } from "@coyle/database/schema";
import { eq } from "drizzle-orm";

export const addReactionToMessage = async ({ reactions, messageId }) => {
  console.log(">>>>>>>>>!!!!!!!!!");
  console.log({ reactions });
  const db = getDB();
  await db
    .update(messages)
    .set({ reactions: reactions })
    .where(eq(messages.id, messageId));
};
