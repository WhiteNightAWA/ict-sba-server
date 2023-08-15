const User = require("../models/user");
const Shop = require("../models/shop");
const {hash} = require("bcrypt");


const shop = async (req, res) => {
    try {
        const { shopID } = req.body;
        if ([shopID].includes(undefined)) {
            return res.status(400).json({
                error: "uncompleted_form",
                error_description: "Somethings is undefined in { shopID }.",
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
    shop,
};
