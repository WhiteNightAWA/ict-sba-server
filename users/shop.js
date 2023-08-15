const User = require("../models/user");
const Shop = require("../models/shop");
const {hash} = require("bcrypt");
const { ObjectId } = require("mongodb");


const shop = async (req, res) => {
    try {
        const { shopID } = req.body;
        if ([shopID].includes(undefined)) {
            return res.status(400).json({
                error: "uncompleted_form",
                error_description: "Somethings is undefined in { shopID }.",
                code: 400,
            });
        }
        
        shop = await Shop.findOne({ "_id": ObjectId(shopID) });

        if (!shop) {
            return res.status(400).json({
                error: "invaild_shopId",
                error_description: "Invaild Shop.",
                code: 400,
            });
        } else {
            shop.HKID = "-";
            return res.status(200).json(shop);
        }


    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "server_error",
            error_description: err.toString(),
            error_json: err,
            code: 500,
        });
    }
};

module.exports = {
    shop,
};
