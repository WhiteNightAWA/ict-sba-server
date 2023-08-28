const express = require("express");
const router = express.Router();
const {get} = require("../shops/get");
const {items} = require("../shops/items");


router.route("/")
    .post((req, res) => {
        res.json("Welcome to the shops.")
    })
    .get((req, res) => {
        res.json("Welcome to the shops.")
    });

router.route("/get/:shopID")
    .get(get);
router.route("/items/:shopID")
    .get(items);


module.exports = router;
