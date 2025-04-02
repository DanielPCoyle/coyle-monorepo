import { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";

export  async function cookieHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const cookies = req.headers.cookie;
  if (!cookies) {
    return res.status(401).json({
      message: "No cookies found",
      cookieDomain: process.env.REACT_APP_COOKIE_DOMAIN,
    });
  }

  const parsedCookies = parse(cookies);
  const jwt = parsedCookies.jwt;
  if (!jwt) {
    return res.status(401).json({ message: "jwt cookie missing" });
  }

  res.status(200).json({ jwt });
}

export default cookieHandler;