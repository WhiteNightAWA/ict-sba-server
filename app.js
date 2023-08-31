const express = require("express");
const bcrypt = require("bcrypt");
const {sign} = require("jsonwebtoken");
const {register} = require("./auth/register");
const {login} = require("./auth/login");
const User = require("./models/user");
const mongoose = require("mongoose");
const EmailVerify = require("./models/emailVerify");
require("dotenv").config();
const nodemailer = require("nodemailer");
const {sendCode} = require("./auth/sendCode");
var cookieParser = require('cookie-parser')

const port = process.env.PORT || 3100;
const cors = require('cors');
const {verifyJWT} = require("./middleware/verifyJWT");
const shop = require("./shop");
const server = express();

server.use(express.json());
server.use(cookieParser());
server.use(cors());

// Data Base
mongoose.connect(process.env.DB_URL, {
	useNewUrlParser: true,
});
const db = mongoose.connection;
db.on("error", (e) => console.log(e));
mongoose.connection.on('connected', function() {
	if (mongoose.connection.client.s.url.startsWith('mongodb+srv')) {
		mongoose.connection.db = mongoose.connection.client.db('main');
	}
	console.log('Connection to MongoDB established.')
});
db.once("open", () => console.log("Connected to Database."));

server.get("/", (req, res) => {
	res.send("Welcome to the backend of https://whitenightawa.github.io/ict-sba/");
});
server.use("/auth", require("./routes/authRouter"));
server.use("/shops", require("./routes/shopsRouter"));
server.use("/data", require("./routes/dataRouter"));
server.route("/user/:user_id")
	.get(async (req, res) => {
		let { user_id } = req.params;
		if ([user_id].includes(undefined)) {
			return res.status(400).json({
				error: "uncompleted_form",
				error_description: "Somethings is undefined in { user_id }.",
				code: 400,
			});
		}
		let user = await User.findOne({ user_id: user_id });
		if (user) {
			user.password = "-";
			return res.status(200).json({
				code: 200,
				success: "get_user_successfully",
				msg: "Get User Successfully",
				user: user,
			})
		} else {
			return res.status(400).json({
				error: "invalid_user",
				error_description: "Invalid User.",
				code: 400,
			});
		}
	});
server.use("/users", verifyJWT, require("./routes/usersRouter"));

server.listen(port, () => {
	console.log(`Server listening to ${process.env.PORT || 3100} port.`);
});


