const express = require("express");
const router = express.Router();
const {get} = require("../shops/get");
const {items} = require("../shops/items");
const {item} = require("../shops/item");
const {verifyJWT} = require("../middleware/verifyJWT");
const {search} = require("../shops/buy");


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
router.route("/items!/:shopID")
    .get(verifyJWT, items);
router.route("/item/:itemId")
    .get(item);
router.route("/search")
    .get(search);

module.exports = router;
