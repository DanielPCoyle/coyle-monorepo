import type { NextApiResponse } from "next";
import type { NextApiRequest } from "next/types";
import dotenv from "dotenv";
dotenv.config();

export const handleCors = (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Origin",
    process.env.NEXT_CORS_ORIGIN || "*",
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type, Authorization",
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // Preflight request response
  }
};
