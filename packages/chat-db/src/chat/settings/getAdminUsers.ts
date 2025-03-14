import { getDB } from "@coyle/chat-db";
import { users } from "@coyle/chat-db/schema";
import type { User } from "@coyle/chat-db/schema";
export async function getAdminUsers(): Promise<User[]> {
  const db = getDB();
  const data: User[] = await db.select().from(users);
  return data;
}
