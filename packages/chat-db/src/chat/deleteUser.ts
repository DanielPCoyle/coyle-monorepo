import { getDB } from "@simpler-development/chat-db";
import { users } from "@simpler-development/chat-db/schema";
import { eq } from "drizzle-orm";

export const deleteUser = async (id: string) => {
  try {
    const db = getDB();
    await db.delete(users).where(eq(users.id, id));
  } catch (error) {
    console.log(error);
    throw new Error("User not found with id: " + id);
  }
};

export default deleteUser;
