import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import { getUserByEmail } from "@coyle/chat-db/src/chat/getUserByEmail";

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || "your-secret-key"; // Keep this secret and only on the backend

export  async function loginHandler(
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
    const user = await getUserByEmail(email);
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name || "blank",
        role: user.role,
        status: user.status,
      },
      JWT_SECRET,
      { expiresIn: "7d" }, // Token valid for 7 days
    );

    return res.status(200).json({ token });
  } catch (error: unknown) {
    return res.status(500).json({ error: (error as Error).message });
  }
}
