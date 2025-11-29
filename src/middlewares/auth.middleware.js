import User from "../model/User.js";
import jwt from "jsonwebtoken";

export default async function auth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        // No Authorization header
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Missing or invalid Authorization header"
            });
        }

        // Extract the token
        const token = authHeader.split(" ")[1];

        // Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid token (user not found)"
            });
        }

        // Attach user to request
        req.user = {
            id: user._id,
            email: user.email,
            name: user.name
        };

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
            detail: error.message
        });
    }
}
