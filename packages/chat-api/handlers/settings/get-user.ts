import { getAdminUser } from "@coyle/chat-db";
import dotenv from "dotenv";
import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../../../../middlewares/auth";
import { handleCors } from "../../../../middlewares/handleCors";

dotenv.config();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  handleCors(req, res);
  if (req.method === "GET") {
    const id = req.query.id as string;
    const users = await getAdminUser(id);
    res.status(200).json(users[0]);
  }
}

export default authMiddleware(handler);
