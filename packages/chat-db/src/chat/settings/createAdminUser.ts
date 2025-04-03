import { users } from "@simpler-development/chat-db/schema";
import { getDB } from "@simpler-development/chat-db/src/db";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;
const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key"; // Replace with a secure key

export const createAdminUser = async ({
  email,
  password,
  name,
  role,
}: {
  email: string;
  password: string;
  name: string;
  role: string;
}) => {
  try {
    // eslint-disable-next-line
    const db: any = getDB();
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const userId = v4();
    await db.insert(users).values({
      id: userId,
      email,
      name,
      passwordHash: hashedPassword,
      isActive: false,
      role: role || "admin",
    });
    const token = jwt.sign({ userId, email, name }, SECRET_KEY, {
      expiresIn: "7d",
    });
    return token;
  } catch (error) {
    console.error("Error creating user:", error.message);
    return null;
  }
};
