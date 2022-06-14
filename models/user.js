const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
var passGenerator = require('generate-password');
const Schema = mongoose.Schema;

const User = new Schema(
    {
        googleId: {
            type: String,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            trim: true,
        },
        phoneNumber: {
            type: String,
            trim: true,
        },
        takenCourses: [{ type: Schema.Types.ObjectId, ref: 'Course', default: [] }],
        currentCourses: [{ type: Schema.Types.ObjectId, ref: 'Course', default: [] }],
        profilePicture: {
            type: String,
            default: 'https://res.cloudinary.com/shanectteam/image/upload/v1634874318/user_zjvzyj.png',
        },
        verified: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            default: "user",
        },
    }, { timestamps: true, collection: 'users' }
);

User.pre('save', async function (next) {
    const user = this;
    if (user.password) {
        if (user.isModified('password')) {
            user.password = await bcrypt.hash(user.password, 8);
        }
    }
    next();
  }
);

User.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_KEY);
    return token;
};
User.methods.generateRandomPassword = async () => {
    return passGenerator.generate({
        length: 12,
        lowercase: true,
        uppercase: true,
        numbers: true,
        symbols: "#?!@$%^&*-",
    })
}

module.exports = mongoose.model('User', User);
