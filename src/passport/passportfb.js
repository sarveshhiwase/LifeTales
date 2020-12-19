const FacebookStrategy = require("passport-facebook").Strategy;
const mongoose = require("mongoose");
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.APP_ID,
        clientSecret: process.env.CLIENT_TOKEN,
        callbackURL: "https://lifetales.herokuapp.com/auth/facebook/callback",
        profileFields: ["id", "displayName", "profileUrl", "name"],
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: "/img/itachi.jpg",
        };
        try {
          const user = await User.findOne({
            googleId: profile.id,
          });
          if (user) {
            done(null, user);
          } else {
            const nuser = await User.create(newUser);
            done(null, nuser);
          }
        } catch (e) {
          console.error(e);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
};
