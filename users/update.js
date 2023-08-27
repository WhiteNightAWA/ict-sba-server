const User = require("../models/user");
const Shop = require("../models/shop");
const {hash} = require("bcrypt");


const update = async (req, res) => {
    try {
        let user = await User.findOne({ user_id: req.user_id });
        if (user.type === "buy") {
            return res.status(400).json({
                code: 400,
                success: "type_error",
                msg: "You are not a seller!",
            });
        } else if (user.type === "sell") {
            const shopData = req.body;
            user = await User.findOne({ user_id: req.user_id });
            shop = await Shop.findOneAndUpdate({ _id: user.shop }, shopData);
            return res.status(200).json({
                code: 200,
                success: "update_successfully",
                msg: "Update Successfully!",
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
    update,
};
