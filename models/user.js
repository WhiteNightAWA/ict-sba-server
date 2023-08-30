const mongoose = require("mongoose");
const ObjectId = require('mongodb').ObjectId;


const userSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        unique: true
    },
    google: {
        type: Boolean,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    photoURL: {
        type: String,
        default: "",
    },
    createTime: {
        type: Date,
        default: Date.now(),
    },
    lastLogin: {
        type: Date,
        default: Date.now(),
    },
    type: {
        type: String,
        default: null
    },
    shop: {
        type: ObjectId,
        default: null
    },
    favorited: {
        type: [String],
        required: true
    },
    followed: {
        type: [String],
        required: true
    },
});

module.exports = mongoose.model("User", userSchema);
