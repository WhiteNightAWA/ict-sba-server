const mongoose = require("mongoose");


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
    shopData: {
        fn: String,
        ln: String,
        HKID: String,
        vat: String,
        shopName: String,
        shopDesc: String,
        shopPhotos: [String],
        rating: [{
            username: String,
            nick: Boolean,
            rate: Number,
            comment: String,
            time: Date,
        }],
        position: [

        ]
    }
});

module.exports = mongoose.model("User", userSchema);
