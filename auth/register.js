const User = require("../models/user");
const EmailVerify = require("../models/emailVerify");
const { hash } = require("bcrypt");
const { v4 } = require("uuid");
const axios = require("axios");
const {doLogin} = require("./login");


const doRegister = async (username, email, password, google, res, picture) => {
    let user = await User.create({
        google: google,
        username: username,
        email: email,
        password: await hash(password, 12),
        user_id: v4(),
        photoURL: picture
    });
    const { user_id } = user;

    if (!google) {
        await EmailVerify.deleteMany({ email: email });
    }
    if (google) {
        await doLogin(user, res);
    } else {
        return res.status(200).json({
            code: 200,
            user_id,
            success: "register_successfully",
            msg: "Sign Up Successfully!",
        })
    }
};
const register = async (req, res) => {
    try {
        const {username, email, code, password} = req.body;

        if ([username, email, code, password].includes(undefined)) {
            return res.status(400).json({
                error: "uncompleted_form",
                error_description: "Somethings is undefined in { username, email, code, password }.",
                code: 400,
            });
        }

        let DBcode = await EmailVerify.find({email: email});
        let codes = DBcode.map(x => x.code);
        console.log(codes)

        if (await User.findOne({email, google: false})) {
            return res.status(400).json({
                error: "register_email_existed",
                error_description: "The email has been registered.",
                code: 400,
            });
        } else if ([null, undefined].includes(DBcode)) {
            return res.status(400).json({
                error: "verify_email_not_sent_or_expired",
                error_description: "Verify email not sent or expired.",
                code: 400,
            });
            
        } else if (codes.includes(Number(code))) {
            return doRegister(username, email, password, false, res, "");
        } else {
            return res.status(400).json({
                error: "verify_code_incorrect",
                error_description: "The verify code of the email incorrect.",
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
}

module.exports = {
    register, doRegister,
}