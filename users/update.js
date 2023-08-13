const User = require("../models/user");
const {hash} = require("bcrypt");


const update = async (req, res) => {
    try {
        const { type } = req.body;
        let user = await User.findOne({ user_id: req.user_id });
        if (type === "buy") {
            return res.status(400).json({
                code: 400,
                success: "type_error",
                msg: "You are not a seller!",
            });
        } else {
            const userData = req.body;
            userData.password = user.password;
            userData.shopData.HKID = user.shopData.HKID;
            user = await User.findOneAndUpdate({ user_id: req.user_id }, userData);
            user.password = "-";
            if (user.shopData?.HKID) {
                user.shopData.HKID = "-"
            }
            return res.status(200).json({
                code: 200,
                success: "update_successfully",
                msg: "Update Successfully!",
                user,
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
