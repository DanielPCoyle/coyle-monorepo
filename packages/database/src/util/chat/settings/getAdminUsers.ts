import { getDB } from "@coyle/database";
import { users } from "@coyle/database/schema";
import type { User } from "@coyle/database/schema";
export async function getAdminUsers(): Promise<User[]> {
  const db = getDB();
  const data: User[] = await db.select().from(users);
  return data;
}
