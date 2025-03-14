import { getDB } from "@coyle/chat-db";
import { users } from "@coyle/chat-db/schema";
import { eq } from "drizzle-orm";

export const getUsersOnline = async () => {
  try {
    const db = getDB();
    const data = await db
      .select()
      .from(users)
      .where(eq(users.status, "online"));
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Error getting users online");
  }
};
