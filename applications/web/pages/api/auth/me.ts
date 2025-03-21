import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { getUserByEmail } from "@coyle/chat-db/src/chat/getUserByEmail";
import { DecodedToken } from "../../../types";
import { serialize } from "cookie";
import { handleCors } from "../../../middlewares/handleCors";

const secret = process.env.NEXT_PUBLIC_JWT_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  handleCors(req, res);
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
    res.setHeader("Set-Cookie", serialize("jwt", token, {
      path: "/",            // Available for all paths
      domain: "."+process.env.REACT_APP_COOKIE_DOMAIN, // Makes it accessible to subdomains
      httpOnly: true,       // Prevents JavaScript access (optional)
      secure: true,         // Only send over HTTPS
      sameSite: "None"       // Adjust as needed
    }));

    const decoded = jwt.verify(token, secret) as DecodedToken;
    if (decoded?.role !== "admin") {
      res.status(200).json({ user: decoded });
    }
    const user = await getUserByEmail(decoded?.email);
    res.status(200).json({ user: user,  cookieDomain: process.env.REACT_APP_COOKIE_DOMAIN, jwt: token });
  } catch (error) {
    res.status(401).json({ message: "Invalid token", error: error.message });
  }
}
