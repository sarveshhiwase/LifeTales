const GithubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new GithubStrategy(
      {
        clientID: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
        callbackURL: "https://lifetales.herokuapp.com/auth/github/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(profile);

        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName || profile.username,
          firstName: profile.displayName || profile.username,
          lastName: profile.displayName || profile.username ,
          image: profile.photos[0].value,
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
