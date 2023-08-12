const User = require("../models/user");
const {hash} = require("bcrypt");


const done = async (req, res) => {
    try {
        const { type } = req.body;
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
        } else {
            const {fn, ln, HKID, vat, shopName, position} = req.body;
            user = await User.findOneAndUpdate({ user_id: req.user_id }, {
                type: "sell",
                shopData: {
                    fn, ln,
                    HKID: await hash(HKID, 12),
                    vat, shopName, position
                }
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
