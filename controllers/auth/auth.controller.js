const { User } = require("../../models/user.js");
const { generateAccessToken, generateRefreshToken, verifyToken } = require("../../utils/jwt.js");
const { setTokenCookies, setAccessTokenCookie } = require("../../utils/cookie.js");
const { sendCreated, sendOk, sendBadRequest, sendServerError, sendUnauthorized } = require("../../utils/response.js");

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * user register controller
 * POST /api/auth/register
 * @param {string} name.body.required - The name of the user
 * @param {string} email.body.required - The email of the user
 * @param {string} password.body.required - The password of the user
 * @returns {object} 200 - An object with a success message and the created user
 * @returns {Error} 400 - Bad request
 */
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return sendBadRequest(res, "Please provide name, email and password");
        }

        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return sendBadRequest(res, "User already exists");
        }

        const user = await User.create({ name, email, password });

        sendCreated(res, "User registered successfully", user);

    } catch (error) {
        sendServerError(res);
    }
}

/**
 * 
 * @param {*} req   
 * @param {*} res
 * user login controller
 * POST /api/auth/login
 * @param {string} email.body.required - The email of the user
 * @param {string} password.body.required - The password of the user
 * @returns {object} 200 - An object with a success message and the user data
 * @returns {Error} 400 - Bad request
 * */

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return sendBadRequest(res, "Please provide email and password");
        }
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return sendBadRequest(res, "Invalid email or password");
        }
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return sendBadRequest(res, "Invalid email or password");
        }

        const payload = { id: user._id, email: user.email };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        setTokenCookies(res, accessToken, refreshToken);

        sendOk(res, "User logged in successfully", user);


    } catch (error) {
        sendServerError(res);
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res
 * refresh token controller
 * POST /api/auth/refresh
 * @returns {object} 200 - New access token
 * @returns {Error} 401 - Unauthorized
 */
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return sendUnauthorized(res, "Refresh token not provided");
        }

        const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) {
            return sendUnauthorized(res, "Invalid refresh token");
        }

        const payload = { id: user._id, email: user.email };
        const newAccessToken = generateAccessToken(payload);

        setAccessTokenCookie(res, newAccessToken);

        sendOk(res, "Token refreshed");

    } catch (error) {
        sendUnauthorized(res, "Invalid refresh token");
    }
}

module.exports = {
    register,
    login,
    refreshToken
}