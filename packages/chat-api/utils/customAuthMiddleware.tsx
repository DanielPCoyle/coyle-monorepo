import jwt from "jsonwebtoken";

export const customAuthMiddleware = async (handler) => { 
    return async (req, res) => {
            return await handler;
    } 
}