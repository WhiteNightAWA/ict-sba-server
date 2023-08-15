const User = require("../models/user");
const Shop = require("../models/shop");
const {hash} = require("bcrypt");


const done = async (req, res) => {
    try {
        const { type } = req.body;

        if ([type].includes(undefined)) {
            return res.status(400).json({
                error: "uncompleted_form",
                error_description: "Somethings is undefined in { type }.",
                code: 400,
            });
        }

        let user = await User.findOne({ user_id: req.user_id });
        if (type === "buy") {
            await User.findOneAndUpdate({ user_id: req.user_id }, {
                type: "buy"
            });
            return res.status(200).json({
                code: 200,
                success: "done_successfully",
                msg: "Done Successfully!",
                sell: false
            });
        } else if (type === "sell") {
            const {fn, ln, HKID, vat, shopName, position} = req.body;
            shop = await Shop.createOne({
                fn, ln,
                HKID: await hash(HKID, 12),
                vat, shopName, position
            })
            user = await User.findOneAndUpdate({ user_id: req.user_id }, {
                type: "sell",
                shop: shop._id
            });
            return res.status(200).json({
                code: 200,
                success: "done_successfully",
                msg: "Done Successfully!",
                user,
                sell: true
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
    done,
};
