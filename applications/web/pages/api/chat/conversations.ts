import { getConversations } from "@coyle/chat-db";
import { authMiddleware } from "../../../middlewares/auth";
import dotenv from "dotenv";
import { NextApiRequest, NextApiResponse } from "next";
import { handleCors } from "../../../middlewares/handleCors";

dotenv.config();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    handleCors(req, res);
    const conversations = await getConversations();
    res.status(200).json(conversations);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
}

export default authMiddleware(handler);
