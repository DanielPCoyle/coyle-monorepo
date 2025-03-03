import { users } from "@coyle/database/schema";
import { getDB } from "@coyle/database/src/db";
import bcrypt from "bcrypt";
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

const SALT_ROUNDS = 10;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  
  try {
    const db = getDB();
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    
    // Insert user into the database
    const insertData = {
      id: uuidv4(),
      email,
      passwordHash: hashedPassword,
      isActive: true,
      role: "user",
    };

    const [newUser] = await db
      .insert(users)
      .values(insertData)
      .returning();

    return res
      .status(201)
      .json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error.message);
    
    return res.status(500).json({ error: error.message });
  }
}
