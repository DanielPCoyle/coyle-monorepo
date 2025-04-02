import { updateUser } from "@coyle/chat-db";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;
export async function updateProfileHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === "PATCH") {
      const user = req.body;

      if (user.password.length > 0) {
        const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
        user.passwordHash = hashedPassword;
      }

      await updateUser(user);
      res.status(200).json({ message: "User updated" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export default updateProfileHandler;
