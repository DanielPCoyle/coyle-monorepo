import { getDB } from "../..";
import { messages } from "../../schema";
import type { Message } from "../../schema";
import { eq } from "drizzle-orm";

export async function updateMessage(id,data): Promise<void> {
  try {
    const db = getDB();
    await db
      .update(messages)
      .set(data as Message)
      .where(eq(messages.id, id));
  } catch (error) {
    console.error("Error adding conversation", error);
  }
}

export default updateMessage;
