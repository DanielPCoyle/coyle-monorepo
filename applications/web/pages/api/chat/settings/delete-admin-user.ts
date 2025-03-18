import { deleteUser } from "@coyle/chat-db";
import dotenv from "dotenv";
import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../../../../middlewares/auth";

dotenv.config();

async function handler(req: NextApiRequest, res: NextApiResponse) {
    try{
        if (req.method === "DELETE") {
          const { id } = JSON.parse(req.body);
          await deleteUser(id);
          res.status(200).json({ message: "User deleted" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export default authMiddleware(handler);
