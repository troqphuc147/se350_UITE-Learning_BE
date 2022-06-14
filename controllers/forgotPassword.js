// require models
const UserModel = require("../models/user");

module.exports.ForgotPassword = function (req, res) {
    const user = res.user
    // handle sent email by using nodemailer
    res.status(200).json('Successfully.');
};

module.exports.GetUserByEmail = async function (req, res, next) {
    const email = req.params.email;

    try {
        const user = await UserModel.find({ email: email });
        if (user) {
            res.user = user;
            next();
        } else {
            res.status(404).json({ message: "User not found." });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error." });
    }
};
