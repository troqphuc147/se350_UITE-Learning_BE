const User = require("../models/user");
const bcrypt = require("bcrypt");
const { transporter } = require("../services/nodemailer");

const userController = {
    getCurrentUser: async (req, res) => {
        try {
            const user = await User.findOne({ _id: req._id });
            if (!user) return res.status(400).json({ msg: "User not found" });

            return res.json({ user });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    register: async (req, res) => {
        try {
            const { fullName, email, password, phoneNumber } = req.body;

            if (!fullName || !email || !password || !phoneNumber)
                return res
                    .status(400)
                    .json({ msg: "Please fill out the information" });

            const user = await User.findOne({ email });

            if (user && user.verified && user.googleId)
                return res
                    .status(400)
                    .json({
                        msg: "The email is used for Google Account. Please Continue with Google!",
                    });

            if (user) {
                if (user.verified) {
                    return res
                        .status(400)
                        .json({
                            msg: "The email is used. Please sign up with another email!",
                        });
                } else {
                    const content = `<a href="${
                        "http://localhost:3000/user/verify/" + user._id
                    }" target="_blank">Click here to verify your account</a>`;
                    const mainOptions = {
                        from: "ProCourses E-learning",
                        to: user.email,
                        subject: "Verify Account in ProCourse",
                        text: "Your text is here",
                        html: content,
                    };
                    transporter.sendMail(mainOptions, function (err, info) {
                        if (err) {
                            return res.status(500).json({ msg: err.message });
                        } else {
                            return res.status(200).json({ msg: "Success" });
                        }
                    });
                    return res.json({ user });
                }
            }

            const newUser = new User({
                fullName,
                email,
                password,
                phoneNumber,
            });
            await newUser.save();

            const content = `<a href="${
                "http://localhost:3000/user/verify/" + newUser._id
            }" target="_blank">Click here to verify your account</a>`;
            const mainOptions = {
                from: "ProCourses E-learning",
                to: newUser.email,
                subject: "Verify Account in ProCourse",
                text: "Your text is here",
                html: content,
            };
            transporter.sendMail(mainOptions, function (err, info) {
                if (err) {
                    return res.status(500).json({ msg: err.message });
                } else {
                    return res.status(200).json({ msg: "success" });
                }
            });

            return res.json({ user: newUser });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    verifyUser: async (req, res) => {
        try {
            const { id } = req.query;

            const user = await User.findOne({ _id: id });

            if (!user) return res.status(400).json({ msg: "User not found" });

            user.verified = true;

            await user.save();

            const token = await user.generateAuthToken();

            return res.json({ msg: "Verify successfully.", user, token });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email)
                return res
                    .status(400)
                    .json({ msg: "Please fill out the information!" });

            const user = await User.findOne({ email });
            if (!user)
                return res
                    .status(400)
                    .json({ msg: "Invalid login credentials" });

            if (!user.verified)
                return res.status(400).json({ msg: "Not verified yet!" });

            if (user.googleId)
                return res
                    .status(400)
                    .json({
                        msg: "The email is used for Google Account. Please Continue with Google!",
                    });

            if (!password)
                return res
                    .status(400)
                    .json({ msg: "Please fill out the information!" });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res
                    .status(400)
                    .json({ msg: "Invalid login credentials" });
            }
            const token = await user.generateAuthToken();
            return res.json({ user, token });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    resetPassword: async (req, res) => {
        const _id = req._id;
        const user = await User.findOne({_id}).exec()

        const { password, newPassword } = req.body;

        try {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Incorrect password" });
            } else {
                user.password = newPassword;
                user.save();

                return res
                    .status(200)
                    .json({ mes: "Reset password successfully", user });
            }
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getNewPassword: async (req, res) => {
        const { email } = req.body;

        try {
            const user = await User.findOne({ email, verified: true }).exec();

            if (!user) {
                return res
                    .status(404)
                    .json({ message: "This email is not verified" });
            } else {
				if(user.googleId) {
					return res
                    .status(404)
                    .json({ message: "This email is signed in with Google Account. Can't use password" });
				}

                const newPassword = await user.generateRandomPassword();

                const content = `<p>New password for your account is <b>${newPassword}<b/></p>`;

                const mainOptions = {
                    from: "ProCourses E-learning",
                    to: email,
                    subject: "New password for Account in ProCourse",
                    text: "Your text is here",
                    html: content,
                };
                transporter.sendMail(mainOptions, function (err, info) {
                    if (err) {
                        return res.status(500).json({ msg: err.message });
                    } else {
                        user.password = newPassword;
                        user.save();
                        return res.status(200).json({
                            mes: "A new password has been sent to your email/phone number, please check.",
                        });
                    }
                });
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({ msg: err.message });
        }
    },
    callback: async (req, res) => {
        const user = req.user;
        const token = await user.generateAuthToken();
        res.redirect(`http://localhost:3000/signinsuccess/${token}`);
    },
    test: async (req, res) => {
        return res.json({ msg: "Verify successfully." });
    },
};

module.exports = userController;
