const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const config = require("../config");
const UserModel = require("../models/UserModel");
const { validate, errorHandler } = require("../util/RouteUtils");

const router = express.Router();

const sendEmail = require("../util/SendEmail");

router.post("/signup", (req, res, next) =>
  passport.authenticate("signup", { session: false }, (resp, user) => {
    if ((resp && resp.errors) || !user) {
      // doesn't seem to be handling duplicate emails correctly after case
      // insensitivity hotfix
      res.status(500).json({
        error: resp.errors.email
          ? "Email is already in use."
          : "Failed to sign up, please try again.",
      });
    } else {
      // send email
      sendEmail.signup(user);

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

    if (!user.active) {
      res.status(403).json({
        error: "Account marked as inactive. Please contact an administrator to reactivate it.",
      });
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

router.post("/forgot", validate(["email"]), (req, res) =>
  UserModel.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        throw new URIError("No user with the given email exists.");
      } else {
        user.resetCode = crypto.randomUUID();
        user.resetDate = new Date();
        return Promise.all([user.save(), sendEmail.reset(user)]);
      }
    })
    .then(() => res.json({ success: true }))
    .catch((err) => {
      if (err instanceof URIError) res.json({ error: err.message });
      else errorHandler(res)(err);
    })
);

router.post("/reset", validate(["code", "password"]), (req, res) =>
  UserModel.findOne({ resetCode: req.body.code })
    .then((user) => {
      // Reset code is valid for 30 minutes
      if (
        !user ||
        req.body.code.trim() === "" ||
        Date.now() - user.resetDate.getTime() > 30 * 60 * 1000
      ) {
        throw new URIError("Email link expired, please return to login.");
      } else {
        user.resetCode = "";
        user.resetDate = new Date(0);
        user.password = req.body.password;
        return user.save();
      }
    })
    .then(() => res.json({ success: true }))
    .catch((err) => {
      if (err instanceof URIError) res.json({ error: err.message });
      else errorHandler(res)(err);
    })
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
