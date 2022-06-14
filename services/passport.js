require('dotenv').config();

const User = require('../models/user');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            passReqToCallback: true,
        }, async (request, accessToken, refreshToken, profile, done) => {
            try {
                const existingUser = await User.findOne({ googleId: profile.id });
                if (existingUser) {
                    return done(null, existingUser);
                }

                const newUser = new User({
                    googleId: profile.id,
                    fullName: profile.name.familyName + ' ' + profile.name.givenName,
                    email: profile.email,
                    profilePicture: profile.picture,
                    verified: true,
                })

                await newUser.save();
                return done(null, newUser);

            } catch (err) {
                return done(err, false);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});
  
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        if (user) 
            done(null, user);
    } catch (err) {
        done(err, null);
    }
});
