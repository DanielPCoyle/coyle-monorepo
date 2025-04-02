import { getMessages } from "@coyle/chat-db";
import jwt from "jsonwebtoken";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next/types";
import { handleCors } from "../../../applications/web/middlewares/handleCors";
import { SECRET_KEY } from "../../../applications/web/pages/api/chat/messages";



export async function messageHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO: make guest middleware authentication
  handleCors(req, res);
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY) as any;
    const { conversationKey } = req.query;

    if (decoded.role === "admin" ||
      decoded.conversationKey === conversationKey) {
      const messages = await getMessages(conversationKey as string);
      res.status(200).json(messages);
    } else {
      res.status(403).json({ error: "Forbidden" });
    }
  } catch (error) {
    console.log("ERROR", error);
    res.status(500).json({ error: error.message });
  }
}

export default messageHandler;