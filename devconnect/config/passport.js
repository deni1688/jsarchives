const JwtStrategy = require("passport-jwt").Strategy;
const ExstractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = require("./keys");

const options = {};
options.jwtFromRequest = ExstractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  passport.use(
    new JwtStrategy(options, (payload, done) => {
      // user jwt payload id to find the user
      User.findById(payload.id)
        .then(user => {
          if (user) {
            // return user if found
            return done(null, user);
          } else {
            // return user if found
            return done(null, false);
          }
        })
        .catch(err => console.log(err));
    })
  );
};
