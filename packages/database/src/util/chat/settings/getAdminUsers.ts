import { getDB } from "@coyle/database";
import { users } from "@coyle/database/schema";

export async function getAdminUsers(): Promise<unknown[]> {
  const db = getDB();
  const data: unknown[] = await db.select().from(users);
  return data;
}
