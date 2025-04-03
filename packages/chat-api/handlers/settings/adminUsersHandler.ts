import { getAdminUsers } from "@simpler-development/chat-db";
import { NextApiRequest, NextApiResponse } from "next";

export async function adminUsersHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const users = await getAdminUsers();
    res.status(200).json(users);
  }
}

export default adminUsersHandler;
