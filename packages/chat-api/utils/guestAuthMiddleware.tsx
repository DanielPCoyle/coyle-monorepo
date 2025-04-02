import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export function guestAuthMiddleware(handler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization;
    const SECRET_KEY = process.env.NEXT_PUBLIC_JWT_SECRET || "your-secret-key"; // Replace with a secure key
    if (!authHeader || !authHeader.startsWith("Bearer ") || false) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    // eslint-disable-next-line
    const decoded = jwt.verify(token, SECRET_KEY) as any;
    const { conversationKey } = req.query;

    if (
      decoded.role === "admin" ||
      decoded.conversationKey === conversationKey
    ) {
      return handler(req, res);
    } else {
      return res.status(403).json({ error: "Forbidden" });
    }
  };
}
