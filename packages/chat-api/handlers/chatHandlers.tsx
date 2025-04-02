import { guestAuthMiddleware } from "@coyle/chat-api";
import { handleCors } from "@coyle/chat-api/utils/handleCors";
import { adminAuthMiddleware } from "../utils/auth";

export function chatHandler(req, res, routes) {
    try {
        handleCors(req, res);
        const { route } = req.query;
        const { method } = req;
        const routeHandler = routes.find(
            (r) => r.route === route && r.method === method
        );
        if (routeHandler) {
            if (routeHandler.auth === "admin") {
                return adminAuthMiddleware(routeHandler.handler(req, res));
            }
            if (routeHandler.auth === "guest") {
                return guestAuthMiddleware(req, res, routeHandler.handler(req, res));
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