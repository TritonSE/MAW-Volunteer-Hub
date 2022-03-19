const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const JWTstrategy = require("passport-jwt").Strategy;

const UserModel = require("../models/UserModel");
const config = require("../config");

module.exports = () => {
  passport.use(
    new JWTstrategy(
      {
        secretOrKey: config.auth.jwt_secret,
        jwtFromRequest: (req) => (req.signedCookies ?? {}).token,
      },
      async (token, done) => {
        try {
          return done(null, token.user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        try {
          const name = req.body.name;
          const user = await UserModel.create({ email, password, name });

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await UserModel.findOne({ email });

          if (!user) {
            return done(null, false, { message: "User not found" });
          }

          const validate = await user.isValidPassword(password);

          if (!validate) {
            return done(null, false, { message: "Wrong Password" });
          }

          return done(null, user, { message: "Logged in Successfully" });
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};
