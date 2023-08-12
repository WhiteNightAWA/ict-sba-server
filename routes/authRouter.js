const express = require("express");
const {login} = require("../auth/login");
const {logout} = require("../auth/logout");
const {sendCode} = require("../auth/sendCode");
const {register} = require("../auth/register");
const router = express.Router();

router.route("/")
    .post((req, res) => {
        res.json("Welcome to the auth.")
    })
    .get((req, res) => {
        res.json("Welcome to the auth.")
    });

router.route("/login")
    .post(login);
router.route("/logout")
    .post(logout);
router.route("/register")
    .post(register);
router.route("/code")
    .post(sendCode);


module.exports = router;
