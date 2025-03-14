import { getDB } from "@coyle/chat-db";
import { users } from "@coyle/chat-db/schema";
import { eq } from "drizzle-orm";

export const getUserByEmail = async (email: string) => {
  try {
    const db = getDB();
    const data = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    const user = data[0];
    return user;
  } catch (error) {
    console.log(error);
    throw new Error("User not found with email: " + email);
  }
};
