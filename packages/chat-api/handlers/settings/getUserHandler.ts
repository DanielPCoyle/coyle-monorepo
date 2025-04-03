import { getAdminUser } from "@simpler-development/chat-db";
import { NextApiRequest, NextApiResponse } from "next";

export async function getUserHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const id = req.query.id as string;
    const users = await getAdminUser(id);
    res.status(200).json(users[0]);
  }
}

export default getUserHandler;
