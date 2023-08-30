const User = require("../models/user");
const Shop = require("../models/shop");
const Items = require("../models/items");
const {ObjectId} = require("mongodb");


const item = async (req, res) => {
    try {
        let { itemId } = req.params;
        if ([itemId].includes(undefined)) {
            return res.status(400).json({
                error: "uncompleted_form",
                error_description: "Somethings is undefined in { itemId }.",
                code: 400,
            });
        }

        try {
            itemId = new ObjectId(itemId);
        } catch (err) {
            return res.status(400).json({
                error: "invalid_itemId",
                error_description: "Invalid Item.",
                err: err.toString(),
                code: 400,
            });
        }

        const item = await Items.findOne({ _id: itemId });
        if (item) {
            return res.status(200).json({
                code: 200,
                success: "get_item_successfully",
                msg: "Get Item Successfully!",
                item: item,
            })
        } else {
            return res.status(400).json({
                error: "invalid_itemId",
                error_description: "Invalid Item.",
                err: err.toString(),
                code: 400,
            });
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
    item,
};
