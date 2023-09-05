const axios = require("axios");
const User = require("../models/user");
const {doRegister} = require("./register");
const {doLogin} = require("./login");

const google = async (req, res) => {
    const { access_token } = req.body.google;
    if ([access_token].includes(undefined)) {
        return res.status(400).json({
            error: "uncompleted_form",
            error_description: "Somethings is undefined in { access_token }.",
            code: 400,
        });
    }

    let response;
    try {
        response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {Authorization: `Bearer ${access_token}`}
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            error: "invalid_access_token",
            error_description: "Invalid access token.",
            code: 400,
        });
    }

    const { name, email, picture } = response.data;
    const user = await User.findOne({email});
    if (!user) {
        return await doRegister(name, email, "google", true, res, picture);
    } else {
        return await doLogin(user, res);
    }

};

module.exports = {
    google,
};
