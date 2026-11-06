import jwt from 'jsonwebtoken';
import tokenBlackListModel from "../models/blacklist-model.js";

export async function authUser(req, resp, next) {
    const token = req.cookies.token;
    if (!token) {
        return resp.status(401).json({
            message: "Token not provided Unauthorized access"
        });
    }
const isTokenBlacklisted = await tokenBlackListModel.findOne({ token });
    if (isTokenBlacklisted) {
        return resp.status(401).json({
            message: "Token is invalid. Please log in again."
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return resp.status(401).json({
            message: "Invalid Token"
        });
    }
}

export default authUser;