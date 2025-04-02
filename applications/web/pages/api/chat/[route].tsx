import * as handlers from '@coyle/chat-api';
import { NextApiRequest, NextApiResponse } from 'next';
import {adminAuthMiddleware} from "../../../middlewares/auth"

const guestAuthMiddleware = (handler) => {
    return handler;
}

const routes = [
    { method: 'GET', route: 'conversations', handler: adminAuthMiddleware(handlers.conversationHandler) },
    { method: 'GET', route: 'messages', handler: guestAuthMiddleware(handlers.messageHandler) }, // TODO: extract guestAuthMiddleware from this handler
    { method: 'PATCH', route: 'update-conversation-language', handler: guestAuthMiddleware(handlers.updateConversationLanguage) },
    { method: 'DELETE', route: 'url-preview', handler: guestAuthMiddleware(handlers.urlPreviewHandler) },
    { method: 'POST', route: 'translate', handler: guestAuthMiddleware(handlers.translateHeader) },
    { method: 'OPTIONS', route: 'send-message-as-email', handler: guestAuthMiddleware(handlers.sendMessageAsEmailHandler)},
]

export default function handler(req:NextApiRequest, res: NextApiResponse) {
    try{
        const { route } = req.query;
        const { method } = req;
        const routeHandler = routes.find(r => r.route === route && r.method === method);
        if (routeHandler) {
            return routeHandler.handler(req, res);
        } else{
            return res.status(404).json({ error: "Not Found" });
        }
    } catch (error) {
        console.error("Error in API handler:", error.message);
        return res.status(500).json({ error: error.message });
    }
  }
  