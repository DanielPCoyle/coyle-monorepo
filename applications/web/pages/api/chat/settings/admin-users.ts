import { getAdminUsers } from "@coyle/chat-db";
import dotenv from "dotenv";
import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../../../../middlewares/auth";
import { handleCors } from "../../../../middlewares/handleCors";

dotenv.config();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  handleCors(req, res);
  if (req.method === "GET") {
    const users = await getAdminUsers();
    res.status(200).json(users);
  }
}

export default authMiddleware(handler);
