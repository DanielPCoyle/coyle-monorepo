import { getDB } from "@coyle/chat-db";
import { users } from "@coyle/chat-db/schema";
import type { User } from "@coyle/chat-db/schema";
import { eq } from "drizzle-orm";
export const updateUser = async (user: User) => {
  try {
    const db = getDB();
    const results = await db
      .update(users)
      .set(user)
      .where(eq(users.id, user.id));
    return results;
  } catch (error) {
    console.log(error);
    throw new Error("User not found with id: " + user.id);
  }
};
