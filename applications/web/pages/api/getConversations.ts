import { getConversations } from '@coyle/database';
import dotenv from "dotenv";
import { NextApiRequest, NextApiResponse } from "next";

dotenv.config();


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const conversations = await getConversations();
  res.status(200).json(conversations);
}
