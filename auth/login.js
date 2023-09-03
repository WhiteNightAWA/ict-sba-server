const User = require("../models/user");
const {compare} = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const doLogin = async (user, res) => {
    await User.findOneAndUpdate({user_id: user.user_id}, {
        lastLogin: Date.now(),
    });

    const AT = jwt.sign({
        email: user.email,
        username: user.username,
        user_id: user.user_id,
    }, process.env.ATS, {
        expiresIn: "30d"
    });

    return res.status(200).cookie("jwt", AT, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        priority: "high",
        httpOnly: false,
        secure: true, // TODO turn on after dev
        sameSite: "None",
    }).json({
        success: "login_successfully",
        msg: "Login successfully!",
        code: 200,
        cookies: ["jwt", AT, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            priority: "high",
            httpOnly: false,
            secure: true, // TODO turn on after dev
        }]
    });
}

const login = async (req, res) => {
    try {
        const {email, password, google} = req.body;
        if (google) {
            const {access_token} = google;
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
            const {email} = response.data;

            const user = await User.findOne({email});
            if (!user) {
                return res.status(400).json({
                    error: "not_register",
                    error_description: "This Email had not register yet.",
                    code: 400,
                });
            }
            if (!user.google) {
                return res.status(400).json({
                    error: "not_google",
                    error_description: "This Email had been register as normal account.",
                    code: 400,
                });
            }

            return await doLogin(user, res);
        }

        if ([email, password].includes(undefined)) {
            return res.status(400).json({
                error: "uncompleted_form",
                error_description: "Somethings is undefined in { email, password }.",
                code: 400,
            });
        }

        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({
                error: "invalid_user",
                error_description: "Invalid User.",
                code: 400,
            });
        }
        console.log(user);
        if (user.google) {
            return res.status(400).json({
                error: "login_by_google",
                error_description: "This email should login by google.",
                code: 400,
            });
        }
        return await doLogin(user, res);
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
    login,
};
