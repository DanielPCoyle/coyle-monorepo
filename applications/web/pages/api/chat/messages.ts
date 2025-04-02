import dotenv from "dotenv";
import { messageHandler as handler } from "@coyle/chat-api";
dotenv.config();
export const SECRET_KEY = process.env.NEXT_PUBLIC_JWT_SECRET || "your-secret-key"; // Replace with a secure key
export default handler;