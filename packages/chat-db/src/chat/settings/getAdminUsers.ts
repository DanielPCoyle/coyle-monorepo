import { getDB } from "@simpler-development/chat-db";
import { users } from "@simpler-development/chat-db/schema";
import type { User } from "@simpler-development/chat-db/schema";
export async function getAdminUsers(): Promise<User[]> {
  const db = getDB();
  const data: User[] = await db.select().from(users);
  return data;
}
