import { guestAuthMiddleware } from "@coyle/chat-api";
import { adminAuthMiddleware } from "../utils/auth";
import { handleCors } from "@coyle/chat-api/utils/handleCors";

export async function chatHandler(req, res, routes) {
    try {
        handleCors(req, res);
        const { route } = req.query;
        const { method } = req;
        const routeHandler = routes.find(
            (r) => r.route === route && r.method === method
        );
        if (routeHandler) {
            const handler = routeHandler.handler;
            if(routeHandler.auth === "guest") {
                guestAuthMiddleware(handler)(req, res);
            } 
            else if (routeHandler.auth === "admin") {
                adminAuthMiddleware(handler)(req, res);
            } else if(typeof routeHandler.auth === "function") {
                routeHandler.auth(handler)(req, res);
            }
        } else {
            return res.status(404).json({ error: "Not Found" });
        }
    } catch (error) {
        console.error("Error in API handler:", error.message);
        return res.status(500).json({ error: error.message });
    }
}

export default chatHandler;