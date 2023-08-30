const User = require("../models/user");
const Shop = require("../models/shop");
const Items = require("../models/items");
const {ObjectId} = require("mongodb");
const {shop} = require("../shop");


const items = async (req, res) => {
    try {
        let { shopID } = req.params;
        if ([shopID].includes(undefined)) {
            return res.status(400).json({
                error: "uncompleted_form",
                error_description: "Somethings is undefined in { shopID }.",
                code: 400,
            });
        }

        try {
            shopID = new ObjectId(shopID);
        } catch (err) {
            return res.status(400).json({
                error: "invalid_shopID",
                error_description: "Invalid Shop.",
                err: err.toString(),
                code: 400,
            });
        }

        if (req.user_id) {

            let user = await User.findOne({user_id: req.user_id});
            if (user.type === "buy") {
                return res.status(400).json({
                    code: 400,
                    error: "type_error",
                    msg: "You are not a seller!",
                });
            } else if (user.type === "sell") {
                if (user.shop.toString() === shopID.toString()) {
                    const items = await Items.find({ shopId: shopID });
                    return res.status(200).json({
                        code: 200,
                        success: "search_successfully",
                        msg: "Search Successfully!",
                        items: items,
                    })
                } else {
                    return res.status(403).json({
                        code: 403,
                        success: "incorrect_shop",
                        error_description: "Incorrect Shop!",
                    });
                }
            }
        }
        const items = await Items.find({ shopId: shopID, visible: true });
        return res.status(200).json({
            code: 200,
            success: "search_successfully",
            msg: "Search Successfully!",
            items: items,
        })
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
    items,
};
