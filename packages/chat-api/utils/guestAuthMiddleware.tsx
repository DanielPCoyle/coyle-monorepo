import jwt from "jsonwebtoken";

export const guestAuthMiddleware = (req, res, handler) => {
    const authHeader = req.headers.authorization;
    const SECRET_KEY = process.env.NEXT_PUBLIC_JWT_SECRET || "your-secret-key"; // Replace with a secure key
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY) as any;
    console.log({ decoded });
    const { conversationKey } = req.query;

    if (decoded.role === "admin" || decoded.conversationKey === conversationKey) {
        return handler;
    } else {
        return res.status(403).json({ error: "Forbidden" });
    }
};
