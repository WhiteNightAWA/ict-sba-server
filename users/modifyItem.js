const User = require("../models/user");
const Shop = require("../models/shop");
const Items = require("../models/items");
const {ObjectId} = require("mongodb");


const addItem = async (req, res) => {
    try {
        let user = await User.findOne({user_id: req.user_id});
        if (user.type === "buy") {
            return res.status(400).json({
                code: 400,
                success: "type_error",
                msg: "You are not a seller!",
            });
        } else if (user.type === "sell") {
            const {imageList, selectedCategory, others, selectedCategoryOther, name, unit, desc, barCode, price} = req.body;
            if ([imageList, selectedCategory, others, selectedCategoryOther, name, unit, desc, barCode, price].includes(undefined)) {
                return res.status(400).json({
                    error: "uncompleted_form",
                    error_description: "Somethings is undefined in body.",
                    code: 400,
                });
            }
            if (
                [name, unit, desc, barCode].includes("") ||
                !(
                    (others && selectedCategoryOther) ||
                    (!others && selectedCategory.length > 0)
                ) ||
                price.filter(e =>
                    e.includes(null) ||
                    e.includes("") ||
                    e[0] < 1 || e[1] < 1
                ).length > 0
            ) {
                return res.status(400).json({
                    error: "error_form",
                    error_description: "Somethings is error in body.",
                    code: 400,
                });
            }

            let shop = await Shop.findOne({ _id: user.shop });
            if (!shop) {
                return res.status(400).json({
                    error: "invalid_shop",
                    error_description: "Invalid Shop.",
                    code: 400,
                });
            }

            let item = await Items.create({
                shopId: shop._id,
                record: [],
                imageList, selectedCategory, others, selectedCategoryOther, name, unit, desc, barCode, price,
            })

            return res.status(200).json({
                code: 200,
                success: "add_item_successfully",
                msg: "Add Item Successfully!",
                itemId: item._id.toString(),
            })

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
const editItem = async (req, res) => {
    try {
        let user = await User.findOne({user_id: req.user_id});
        if (user.type === "buy") {
            return res.status(400).json({
                code: 400,
                success: "type_error",
                msg: "You are not a seller!",
            });
        } else if (user.type === "sell") {
            const update = req.body;
            let { itemId } = req.params;
            if ([itemId].includes(undefined)) {
                return res.status(400).json({
                    error: "uncompleted_form",
                    error_description: "Somethings is undefined in { itemId }.",
                    code: 400,
                });
            }

            let shop = await Shop.findOne({ _id: user.shop });
            if (!shop) {
                return res.status(400).json({
                    error: "invalid_shop",
                    error_description: "Invalid Shop.",
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

            let item = await Items.findOne({ _id: itemId });
            if (item) {
                item = await Items.findOneAndUpdate({ _id: itemId }, update);
                return res.status(200).json({
                    code: 200,
                    success: "updated_successfully",
                    msg: "Updated Successfully!",
                    item: await Items.findOne({ _id: itemId })
                });
            } else {
                return res.status(400).json({
                    error: "invalid_itemId",
                    error_description: "Invalid Item.",
                    err: err.toString(),
                    code: 400,
                });
            }

            return res.status(200).json({
                code: 200,
                success: "add_item_successfully",
                msg: "Add Item Successfully!",
                itemId: item._id.toString(),
            })

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
const deleteItem = async (req, res) => {
    try {
        let user = await User.findOne({user_id: req.user_id});
        if (user.type === "buy") {
            return res.status(400).json({
                code: 400,
                success: "type_error",
                msg: "You are not a seller!",
            });
        } else if (user.type === "sell") {
            let { itemId } = req.params;
            if ([itemId].includes(undefined)) {
                return res.status(400).json({
                    error: "uncompleted_form",
                    error_description: "Somethings is undefined in { itemId }.",
                    code: 400,
                });
            }

            let shop = await Shop.findOne({ _id: user.shop });
            if (!shop) {
                return res.status(400).json({
                    error: "invalid_shop",
                    error_description: "Invalid Shop.",
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

            let item = await Items.findOne({ _id: itemId });
            if (item) {
                item = await Items.findByIdAndDelete(itemId);
                return res.status(200).json({
                    code: 200,
                    success: "deleted_successfully",
                    msg: "Deleted Successfully!",
                });
            } else {
                return res.status(400).json({
                    error: "invalid_itemId",
                    error_description: "Invalid Item.",
                    err: err.toString(),
                    code: 400,
                });
            }

            return res.status(200).json({
                code: 200,
                success: "add_item_successfully",
                msg: "Add Item Successfully!",
                itemId: item._id.toString(),
            })

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
    addItem, editItem, deleteItem
};
