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
        const {email, password} = req.body;

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
        compare(user.password, password, async (err, resp) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: "server_error",
                    error_description: err.toString(),
                    error_json: err,
                    code: 500,
                });
            }
            if (resp) {
                return await doLogin(user, res);
            } else {
                return res.status(400).json({
                    error: "incorrect_email_or_password",
                    error_description: "Incorrect Email or Password.",
                    code: 400,
                });
            }
        });
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
    login, doLogin,
};
