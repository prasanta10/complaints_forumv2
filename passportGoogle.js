require("dotenv").config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("./models/user")
const {ObjectId} = require("mongodb")

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
},
    async function (accessToken, refreshToken, profile, cb) {
        /*if(profile._json.hd !== 'smvdu.ac.in')
        {
            return cb(null, false);
        }*/
        const user = await User.find({googleID: profile.id})
        if(user.length === 0)
        {
            const newUser = new User({
                username: profile.displayName,
                googleID: profile.id,
                email: profile.emails[0].value,
                picture: profile._json.picture
            })
            console.log("new user")
            await newUser.save()
        }
        else{
            console.log("existing user")
        }
        return cb(null, profile);
    }
));