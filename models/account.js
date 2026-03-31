
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const schema = new mongoose.Schema({
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [ true, "Please enter user id"],
        index: true,
    },
    status: {
        type: String,
        enum: {
            values: ["active", "frozen", "closed"],
            message: "Status must be either active, frozen or closed",
        },
        default: "active",
    },
    currency: {
        type: String,
        default: "PKR",
        required: [true, "Please enter currency"],
    },

}, {
    timestamps: true,
});

AccountSchema.index({ User: 1 , status: 1 });


/**
 * @typedef Account
 * @property {string} User.required - The user id of the account owner
 * @property {string} status - The status of the account
 * @property {string} currency - The currency of the account
 * @property {Date} createdAt - The date the account was created
 * @property {Date} updatedAt - The date the account was last updated
 */
const Account = mongoose.model("Account", schema);

module.exports = { Account };
