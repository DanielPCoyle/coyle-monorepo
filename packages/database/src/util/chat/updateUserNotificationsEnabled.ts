import { getDB } from "../../../";
import { users } from "../../../schema";
import { eq } from "drizzle-orm";

export async function updateUserNotificationsEnabled({
  id,
  notificationsEnabled,
}): Promise<void> {
  try {
    const db = getDB();
    await db
      .update(users)
      .set({ notificationsEnabled: notificationsEnabled })
      .where(eq(users.id, id));
  } catch (error) {
    console.error("Error adding conversation", error);
  }
}

export default updateUserNotificationsEnabled;
