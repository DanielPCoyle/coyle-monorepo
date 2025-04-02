import type { NextApiRequest, NextApiResponse } from "next";
import { createAdminUser } from "@coyle/chat-db";
import { sendWelcomeEmail } from "../../utils/sendWelcomeEmail";

export  async function registerHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { name, email, role } = req.body;

  if (!email || !name) {
    return res.status(400).json({ error: "Email and name are required" });
  }

  try {
    const password = Math.random().toString(36).slice(-8);
    const token = await createAdminUser({ email, password, name, role });
    if (token) {
      await sendWelcomeEmail(name, email, password);
      return res
        .status(201)
        .json({ message: "User created successfully", token });
    } else {
      return res.status(500).json({ error: "Error creating user" });
    }
  } catch (error) {
    console.error("Error creating user:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
