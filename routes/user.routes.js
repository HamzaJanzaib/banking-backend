const express = require("express");
const router = express.Router();
const { User } = require("../models/user.js");
const { register, login , refreshToken } = require("../controllers/auth/auth.controller.js");

/**
 * @route POST /api/users/register
 * @group Users - Operations about user
 */
router.post("/register", register);

/**
 * @route POST /api/users/login
 * @group Users - Operations about user 
 */
router.post("/login", login);

/**
 * @route GET /api/users/refresh
 * @group Users - Operations about user
 */
router.get("/refresh", refreshToken);
module.exports = router;