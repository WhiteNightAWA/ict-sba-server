const express = require("express");
const router = express.Router();
const User = require("../models/user");
const {done} = require("../users/done");
const {update} = require("../users/update");
const {shop} = require("../shop");


router.route("/")
    .post((req, res) => {
        res.json("Welcome to the users.")
    })
    .get((req, res) => {
        res.json("Welcome to the users.")
    });

router.route("/test")
    .get(async (req, res) => {
        try {
            const user = await User.findOne({ user_id: req.user_id });
            user.password = "-";
            if (user.shopData?.HKID) {
                user.shopData.HKID = "-"
            }
            res.status(200).json(user);
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                error: "server_error",
                error_description: err.toString(),
                error_json: err,
                code: 500,
            });
        }
    });
router.route("/done")
    .post(done);
router.route("/update")
    .post(update);


module.exports = router;
