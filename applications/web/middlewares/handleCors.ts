import type { NextApiResponse } from "next";
import type { NextApiRequest } from "next/types";

export const handleCors = (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "https://shop.philaprints.com");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // Preflight request response
  }
};
