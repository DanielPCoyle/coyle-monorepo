import { getConversations } from "@coyle/chat-db";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next/types";

export async function conversationHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const conversations = await getConversations();
    res.status(200).json(conversations);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
}
