import { getMessages } from "@coyle/database";
import dotenv from "dotenv";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

dotenv.config();

const SECRET_KEY = process.env.NEXT_PUBLIC_JWT_SECRET || "your-secret-key"; // Replace with a secure key


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {

  try{
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY) as any;
    const { conversationKey } = req.query;

    if(decoded.role === "admin" || decoded.conversationKey === conversationKey){
      const messages = await getMessages(conversationKey as string);
      res.status(200).json(messages);
    }else{
      res.status(403).json({ error: "Forbidden" });
    }
  } catch (error) {
    console.log("ERROR",error)
    res.status(500).json({ error: error.message });
  }
}
