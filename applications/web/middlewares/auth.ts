import { users } from "@coyle/database/schema";
import { getDB } from "@coyle/database/src/db";
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key"; // Replace with a secure key

export function authMiddleware(handler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
      // Verify the token
      const decoded = jwt.verify(token, SECRET_KEY);

      const db = getDB();
      const user = await db
        .select()
        .from(users)
        .where(users.id.eq(decoded.userId))
        .limit(1);

      if (!user.length) {
        return res.status(403).json({ error: "Forbidden" });
      }

      // Attach user data to request
      req.user = user[0];

      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  };
}
