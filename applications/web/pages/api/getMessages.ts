import { getMessages } from "@coyle/database";
import dotenv from "dotenv";
import { NextApiRequest, NextApiResponse } from "next";

dotenv.config();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { conversationKey } = req.query;
  const messages = await getMessages(conversationKey as string);
  res.status(200).json(messages);
}
