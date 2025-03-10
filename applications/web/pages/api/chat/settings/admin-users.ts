import { getAdminUsers } from "@coyle/database";
import dotenv from "dotenv";
import { NextApiRequest, NextApiResponse } from "next";

dotenv.config();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method === "GET") {
        const users = await getAdminUsers();
        res.status(200).json(users);
    } 
}
