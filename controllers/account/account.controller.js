const { Account } = require("../../models/account.js");
const { sendCreated, sendOk, sendBadRequest, sendServerError, sendUnauthorized } = require("../../utils/response.js");
const emailService = require("../../services/email.service.js");

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * Account create controller
 * POST /api/account
 * @returns {object} 200 - An object with a success message and the created account
 * @returns {Error} 400 - Bad request
 */
const CreateAccount = async (req, res) => {
    try {

        const user = req.user;

        if (!user) {
            return sendUnauthorized(res, "User not authenticated");
        }

        const account = await Account.create({ userId: user.id });

        sendCreated(res, "Account created successfully", account);

        await emailService.sendAccountCreationEmail(user.email, user.name);

    } catch (error) {
        sendServerError(res);
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * Account create controller
 * GET /api/account
 * @returns {object} 200 - An object with a success message and the created account
 * @returns {Error} 400 - Bad request
 */
const GetAccounts = async (req, res) => {
    try {

        const user = req.user;

        if (!user) {
            return sendUnauthorized(res, "User not authenticated");
        }

        const account = await Account.create({ userId: user.id });

        sendCreated(res, "Account created successfully", account);

        await emailService.sendAccountCreationEmail(user.email, user.name);

    } catch (error) {
        sendServerError(res);
    }
}

module.exports = {
    CreateAccount,
    GetAccounts
}