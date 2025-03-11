import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { getUserByEmail } from "@coyle/database/src/util/chat/getUserByEmail";
import { DecodedToken } from "../../../types";

const secret = process.env.NEXT_PUBLIC_JWT_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, secret) as DecodedToken;
    const user = await getUserByEmail(decoded?.email);
    res.status(200).json({ user: user });
  } catch (error) {
    res.status(401).json({ message: "Invalid token", error: error.message });
  }
}
