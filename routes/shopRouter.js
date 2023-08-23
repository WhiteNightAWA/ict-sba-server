const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Shop = require("../models/shop");
const { ObjectId } = require("mongodb");


router.route("/")
    .post((req, res) => {
        res.json("Welcome to the shops.")
    })
    .get((req, res) => {
        res.json("Welcome to the shops.")
    });

router.route("/get/:shopID")
    .get(async (req, res) => {
        try {
            let { shopID } = req.params;
            try {
                shopID = new ObjectId(shopID);
            } catch (err) {
                return res.status(400).json({
                    error: "invaild_shopId",
                    error_description: "Invaild Shop.",
                    err: err.toString(),
                    code: 400,
                });
            }

            const shop = await Shop.findOne({ "_id": shopID });

            if (!shop) {
                return res.status(400).json({
                    error: "invaild_shopId",
                    error_description: "Invaild Shop.",
                    code: 400,
                });
            } else {
                return res.status(200).json(shop);
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


module.exports = router;
