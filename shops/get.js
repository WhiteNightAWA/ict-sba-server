const User = require("../models/user");
const Shop = require("../models/shop");
const Items = require("../models/items");
const {ObjectId} = require("mongodb");


const get = async (req, res) => {
    try {
        let { shopID } = req.params;
        try {
            shopID = new ObjectId(shopID);
        } catch (err) {
            return res.status(400).json({
                error: "invalid_shopId",
                error_description: "Invalid Shop.",
                err: err.toString(),
                code: 400,
            });
        }

        const shop = await Shop.findOne({ "_id": shopID });

        if (!shop) {
            return res.status(400).json({
                error: "invalid_shopId",
                error_description: "Invalid Shop.",
                code: 400,
            });
        } else {
            let get_type = req.headers.get_type;
            if (get_type) {
                switch (get_type) {
                    case "rating":
                        let rating = await Items.find({ shopId: shop._id }, {
                            name: 1, rating: 1, _id: 1,
                        });
                        return res.status(200).json({
                            code: 200,
                            success: "get_rating_successfully",
                            msg: "Get Rating Successfully!",
                            rating: rating,
                        })
                    default:
                        return res.status(400).json({
                            error: "invalid_type",
                            error_description: "Invalid Type.",
                            code: 400,
                        });
                }
            } else {
                shop.HKID = "-";
                return res.status(200).json(shop);
            }
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
    get,
};
