import * as handlers from '@coyle/chat-api';
import { NextApiRequest, NextApiResponse } from 'next';
import {adminAuthMiddleware} from "../../../middlewares/auth"
import jwt from "jsonwebtoken";
import { handleCors } from '@coyle/chat-api/utils/handleCors';

const guestAuthMiddleware = (req,res, handler) => {
      const authHeader = req.headers.authorization;
        const SECRET_KEY = process.env.NEXT_PUBLIC_JWT_SECRET || "your-secret-key"; // Replace with a secure key
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return res.status(401).json({ error: "Unauthorized" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, SECRET_KEY) as any;
        console.log({decoded})
        const { conversationKey } = req.query;
    
        if (decoded.role === "admin" ||
            decoded.conversationKey === conversationKey) 
        {
            return handler;
        } 
        else {
            return res.status(403).json({ error: "Forbidden" });
        }
}

const routes = [
{ method: 'GET', auth:"admin", route: 'conversations', handler: handlers.conversationHandler },
{ method: 'GET', auth:"guest", route: 'messages', handler: handlers.messageHandler }, // TODO: extract guestAuthMiddleware from this handler
{ method: 'POST', auth:"guest", route: 'update-conversation-language', handler: handlers.updateConversationLanguage },
{ method: 'GET', auth:"guest", route: 'url-preview', handler: handlers.urlPreviewHandler },
{ method: 'POST', auth:"guest", route: 'translate', handler: handlers.translateHeader },
{ method: 'OPTIONS', auth:"guest", route: 'send-message-as-email', handler: handlers.sendMessageAsEmailHandler},
{ method : "GET", auth:"admin", route: "admin-users", handler: handlers.adminUsersHandler},
{ method : "GET", auth:"admin", route: "get-user", handler: handlers.getUserHandler},
{ method : "PATCH", auth:"admin", route: "update-profile", handler: handlers.updateProfileHandler},  
]

export default function handler(req:NextApiRequest, res: NextApiResponse) {
    try{
        handleCors(req, res);
        const { route } = req.query;
        const { method } = req;
        const routeHandler = routes.find(r => r.route === route && r.method === method);
        if (routeHandler) {
            if(routeHandler.auth === "admin"){
            return adminAuthMiddleware(routeHandler.handler(req, res));
            } 
            if(routeHandler.auth === "guest"){
                return guestAuthMiddleware(req,res, routeHandler.handler(req, res));
            }
        } else{
            return res.status(404).json({ error: "Not Found" });
        }
    } catch (error) {
        console.error("Error in API handler:", error.message);
        return res.status(500).json({ error: error.message });
    }
  }
  