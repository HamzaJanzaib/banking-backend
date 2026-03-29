const { User } = require("../../models/user.js");
const { generateAccessToken, generateRefreshToken, verifyToken } = require("../../utils/jwt.js");

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
            return res.status(400).json({ success: false, message: "Please provide name, email and password" });
        }

        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const user = await User.create({ name, email, password });

        res.status(201).json({ success: true, message: "User registered successfully", user });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
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
            return res.status(400).json({ success: false, message: "Please provide email and password" });
        }
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const payload = { id: user._id, email: user.email };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({ success: true, message: "User logged in successfully", user });


    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
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
            return res.status(401).json({ success: false, message: "Refresh token not provided" });
        }

        const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid refresh token" });
        }

        const payload = { id: user._id, email: user.email };
        const newAccessToken = generateAccessToken(payload);

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        });

        res.status(200).json({ success: true, message: "Token refreshed" });

    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid refresh token" });
    }
}

module.exports = {
    register,
    login,
    refreshToken
}