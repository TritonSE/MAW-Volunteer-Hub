const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const config = require("../config");
const UserModel = require("../models/UserModel");
const { validate, errorHandler } = require("../util/RouteUtils");

const router = express.Router();

router.post("/signup", (req, res, next) =>
  passport.authenticate("signup", { session: false }, (resp, user) => {
    if ((resp && resp.errors) || !user) {
      res.status(500).json({
        error: resp.errors.email
          ? "Email is already in use."
          : "Failed to sign up, please try again.",
      });
    } else {
      res.json({
        success: true,
        user: user.toJSON(),
      });
    }
  })(req, res, next)
);

router.post("/login", validate(["email", "password", "remember"], []), (req, res, next) =>
  passport.authenticate("login", (err, user) => {
    if (err || !user) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    if (!user.verified) {
      res.status(401).json({ error: "Account not yet verified." });
      return;
    }

    req.login(user, { session: false }, (error) => {
      if (error) {
        errorHandler(res)(error);
        return;
      }

      const token = jwt.sign(
        {
          user: {
            _id: user._id,
            email: user.email,
            name: user.name,
            admin: user.admin,
          },
        },
        config.auth.jwt_secret
      );

      const cookie_opts = { signed: true };
      if (req.body.remember && req.body.remember !== "undefined") {
        // Fix for odd stringify in Chrome
        const exp = new Date();
        exp.setDate(exp.getDate() + 30);
        cookie_opts.expires = exp;
      }
      res.cookie("token", token, cookie_opts);
      res.json({ success: true, user: user.toJSON() });
    });
  })(req, res, next)
);

router.post("/signout", (req, res) => {
  res.clearCookie("token", { signed: true });
  res.json({ success: true });
});

router.post("/token", passport.authenticate("jwt", { session: false }), (req, res) => {
  UserModel.findById((req.user ?? {})._id)
    .then((user) => res.json({ user: user.toJSON() }))
    .catch(() => res.status(404).json({ error: "No such user exists." }));
});

module.exports = router;
