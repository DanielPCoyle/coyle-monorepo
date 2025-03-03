import { users } from "@coyle/database/schema";
import { getDB } from "@coyle/database/src/db";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET;

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
    // Fetch the user from the database
    const data = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (data.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = data[0];

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }, // Token expires in 1 hour
    );

    return res.status(200).json({ token });
  } catch (error: unknown) {
    return res.status(500).json({ error: (error as Error).message });
  }
}
