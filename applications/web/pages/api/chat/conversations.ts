import dotenv from "dotenv";
import { authMiddleware } from "../../../middlewares/auth";
import { conversationHandler as handler } from "@coyle/chat-api";

dotenv.config();
export default authMiddleware(handler);