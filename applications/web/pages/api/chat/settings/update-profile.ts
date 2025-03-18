import { updateUser } from "@coyle/chat-db";
import dotenv from "dotenv";
import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../../../../middlewares/auth";
import bcrypt from "bcrypt";

dotenv.config();
const SALT_ROUNDS = 10;
async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "PATCH") {
      const user = req.body;

      if (user.password.length > 0) {
        const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
        user.passwordHash = hashedPassword;
      }

      console.log({ user });
      await updateUser(user);
      res.status(200).json({ message: "User updated" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export default authMiddleware(handler);
