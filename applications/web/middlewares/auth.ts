import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { getUserByEmail } from "@coyle/database/src/util/chat/getUserByEmail";
import type { DecodedToken } from "../types";


const SECRET_KEY = process.env.NEXT_PUBLIC_JWT_SECRET || "your-secret-key"; // Replace with a secure key

declare module "next" {
  interface NextApiRequest {
    user?: any;
  }
}

export function authMiddleware(handler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
      // Verify the token
      const decoded = jwt.verify(token, SECRET_KEY) as DecodedToken;
      const user = await getUserByEmail(decoded.email);
      if (!user) {
        return res.status(403).json({ error: "Forbidden" });
      }

      // Attach user data to request
      req.user = user[0];

      return handler(req, res);
    } catch (error) {
      return res
        .status(401)
        .json({ error: "Invalid or expired token", message: error.message });
    }
  };
}
