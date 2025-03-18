import { getDB } from "@coyle/chat-db";
import { users } from "@coyle/chat-db/schema";
import type { User } from "@coyle/chat-db/schema";
import {eq} from "drizzle-orm"

export async function getAdminUser(id): Promise<User[]> {
  const db = getDB();
  const data: User[] = await db.select().from(users).where(eq(users.id,id));
  return data;
}
