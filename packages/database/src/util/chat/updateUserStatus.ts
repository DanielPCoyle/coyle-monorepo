import { getDB } from "../../../";
import { users } from "../../../schema";
import type { User } from "../../../schema";
import { eq } from "drizzle-orm";

export async function updateUserStatus({ id, status }): Promise<void> {
  try {
    const db = getDB();
    await db
      .update(users)
      .set({ status } as User)
      .where(eq(users.id, id));
  } catch (error) {
    console.error("Error adding conversation", error);
  }
}

export default updateUserStatus;
