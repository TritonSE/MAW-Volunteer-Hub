/* eslint consistent-return: "warn" */

const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/UserModel");
const { validate, errorHandler } = require("../util/RouteUtils");

const router = express.Router();

// Sign up route
router.post("/signup", passport.authenticate("signup", { session: false }), (req, res) => {
  Promise.all([User.findById(req.user._id), bcrypt.hash(req.body.password, 10)])
    .then(([user, password]) => {
      Object.assign(user, {
        name: req.body.name,
        password,
      });
      return user.save();
    })
    .then(() => res.json({ success: true }))
    .catch(errorHandler(res, false));
});

// Log In route
router.post("/login", validate(["email", "password", "remember"], [], false), (req, res, next) => {
  passport.authenticate("login", (err, user) => {
    try {
      if (err || !user) {
        res.json({ error: "Failed to log in" });
        return;
      }

      req.login(user, { session: false }, (error) => {
        if (error) {
          res.json({ error });
          return;
        }

        const body = { _id: user._id, email: user.email }; // sign is admin into this body
        const token = jwt.sign({ user: body }, "TOP_SECRET");

        const cookie_opts = { signed: true };
        if (req.body.remember && req.body.remember !== "undefined") {
          // Fix for odd stringify in Chrome
          const exp = new Date();
          exp.setDate(exp.getDate() + 30);
          cookie_opts.expires = exp;
        }
        res.cookie("token", token, cookie_opts);
        res.json({ success: true });
      });
    } catch (error) {
      res.json({ error });
    }
  })(req, res, next);
});

router.post("/signout", (req, res) => {
  res.clearCookie("token", { signed: true });
  res.json({ success: true });
});

// Token validation route
router.post("/token", passport.authenticate("jwt", { session: false }), (req, res) =>
  res.json({ valid: Boolean(req.user) })
);

module.exports = router;
