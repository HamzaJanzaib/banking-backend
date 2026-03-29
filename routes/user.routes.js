const express = require("express");
const router = express.Router();
import { User } from "../models/user.js";
import { register, login } from "../controllers/auth/auth.controller.js";

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

export default router;