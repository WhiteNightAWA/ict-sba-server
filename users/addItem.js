const User = require("../models/user");
const Shop = require("../models/shop");
const Items = require("../models/items");


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

module.exports = {
    addItem,
};
