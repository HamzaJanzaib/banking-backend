const express = require("express");
const { register, login, refreshToken } = require("../controllers/auth/auth.controller.js");

/**
 * @route POST /api/auth/register
 * @group Auth - Authentication operations
 */
router.post("/register", register);

/**
 * @route POST /api/auth/login
 * @group Auth - Authentication operations
 */
router.post("/login", login);

/**
 * @route POST /api/auth/refresh
 * @group Auth - Authentication operations
 */
router.post("/refresh", refreshToken);

module.exports = router;