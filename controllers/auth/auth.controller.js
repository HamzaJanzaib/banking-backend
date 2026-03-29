const { User } = require("../../models/user");

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
        const isMatch = await user.validPassword(password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }
        res.status(200).json({ success: true, message: "User logged in successfully", user });


    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

module.exports = {
    register,
    login
}