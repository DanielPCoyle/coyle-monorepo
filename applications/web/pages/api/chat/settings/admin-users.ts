import { getAdminUsers } from "@coyle/database";
import dotenv from "dotenv";
import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../../../../middlewares/auth";

dotenv.config();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const users = await getAdminUsers();
    res.status(200).json(users);
  }
}

export default authMiddleware(handler);
