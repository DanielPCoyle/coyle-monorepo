import { users } from "@coyle/database/schema";
import { getDB } from "@coyle/database/src/db";
import bcrypt from "bcrypt";
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;
const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key"; // Replace with a secure key

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const db = getDB();
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const userId = uuidv4();

    await db.insert(users).values({
      id: userId,
      email,
      passwordHash: hashedPassword,
      isActive: false,
      role: "user",
    });

    // Generate JWT token
    const token = jwt.sign({ userId, email }, SECRET_KEY, { expiresIn: "7d" });

    return res.status(201).json({ message: "User created successfully", token });
  } catch (error) {
    console.error("Error creating user:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
