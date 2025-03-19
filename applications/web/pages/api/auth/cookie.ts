import { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";


const secret = process.env.NEXT_PUBLIC_JWT_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
    const cookies = req.headers.cookie;
    if (!cookies) {
        return res.status(401).json({ message: "No cookies found" });
    }

    const parsedCookies = parse(cookies);
    const authToken = parsedCookies.authToken;
    if (!authToken) {
        return res.status(401).json({ message: "authToken cookie missing" });
    }

    res.status(200).json({ authToken });
}

    