const express = require("express");
const { CreateAccount , GetAccounts } = require("../controllers/account/account.controller.js");
const { authMiddleware } = require("../middlewares/auth.js");

const router = express.Router();
/**
 * @route POST /api/account
 * @group Account - Account operations
 * - create a new account for the authenticated user
 * - Requires authentication
 */
router.post("/", authMiddleware, CreateAccount);

/**
 * @route GET /api/account
 * @group Account - Account operations  
 * - get all accounts of the authenticated user
 * - Requires authentication
*/
router.get("/", authMiddleware, GetAccounts);


module.exports = router;