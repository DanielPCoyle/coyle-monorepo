import { getMessages } from "@simpler-development/chat-db";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next/types";

export async function messageHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { conversationKey } = req.query;
    const messages = await getMessages(conversationKey as string);
    res.status(200).json(messages);
  } catch (error) {
    console.log("ERROR", error);
    res.status(500).json({ error: error.message });
  }
}

export default messageHandler;
