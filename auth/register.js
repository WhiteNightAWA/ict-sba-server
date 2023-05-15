const User = require("../models/user");
const EmailVerify = require("../models/emailVerify");
const jwt = require("jsonwebtoken");


function genAT(userID) {
    return jwt.sign({
        userID
    }, process.env.AT_TOKEN, {
        expiresIn: "1h",
    })
}
function genRT(userID, RTID) {
    return jwt.sign({
        userID, RTID
    }, process.env.RT_TOKEN, {
        expiresIn: "30d",
    })
}


const register = async (req, res) => {
    try {
        const { username, email, code, password } = req.body;

        console.log(username, email, code, password);

        if ([username, email, code, password].includes(undefined)) {
            return res.status(400).json({
                error: "uncompleted_form",
                error_description: "Somethings is undefined in { username, email, code, password }.",
                code: 400,
            });
        }

        DBcode = await EmailVerify.findOne({email});

        if (await User.findOne({email, google: false })) {
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
        } else if (DBcode.code === code) {
            // register user

            let user = User({

            })



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
            error_description: err,
            code: 500,
        });
    }
}

module.exports = {
    register
}