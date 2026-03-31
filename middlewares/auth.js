const {User} = require("../models/user.js");
const { verifyToken } = require("../utils/jwt.js");
const { sendUnauthorized } = require("../utils/response.js");

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken || req.headers["authorization"]?.split(" ")[1];

        if (!token) {
            return sendUnauthorized(res, "Access token is missing");
        }

        const decoded = verifyToken(token);
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return sendUnauthorized(res, "User not found");
        }
        req.user = user;
        next();
    } catch (error) {
        return sendUnauthorized(res, "Invalid access token");

    }
}

module.exports = {
    authMiddleware
};