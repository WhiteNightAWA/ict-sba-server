const User = require("../models/user");
const Shop = require("../models/shop");
const {hash} = require("bcrypt");


const update = async (req, res) => {
    try {
        let { type } = req.body;
        if ([type].includes(undefined)) {
            return res.status(400).json({
                error: "uncompleted_form",
                error_description: "Somethings is undefined in { type }.",
                code: 400,
            });
        }

        let user = await User.findOne({ user_id: req.user_id });

        switch (type) {
            case "shop":
                if (user.type === "buy") {
                    return res.status(400).json({
                        code: 400,
                        error: "type_error",
                        error_description: "You are not a seller!",
                    });
                } else if (user.type === "sell") {
                    const shopData = req.body;
                    shop = await Shop.findOneAndUpdate({ _id: user.shop }, shopData);
                    return res.status(200).json({
                        code: 200,
                        success: "update_successfully",
                        msg: "Update Successfully!",
                    });
                } else {
                    return res.status(200).json({
                        code: 200,
                        error: "unknown_error",
                        error_description: "Unknown Error!",
                    });
                }
            case "user":
                user = await User.findOneAndUpdate({ user_id: req.user_id }, { ...req.body.update });
                return res.status(200).json({
                    code: 200,
                    success: "update_successfully",
                    msg: "Update Successfully!",
                });
            default:
                return res.status(400).json({
                    code: 400,
                    error: "invalid_type",
                    error_description: "Invalid Type!",
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
