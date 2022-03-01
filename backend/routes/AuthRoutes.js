/* eslint consistent-return: "warn" */

const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Sign up route
router.post("/signup", passport.authenticate("signup", { session: false }), (req, res) =>
  res.json({
    message: "Signup successful",
    user: req.user,
  })
);

// Log In route
router.post("/login", (req, res, next) => {
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

        const uid = user._id;

        res.json({ token, uid });
      });
    } catch (error) {
      res.json({ error });
    }
  })(req, res, next);
});

// Token validation route
router.post("/token", passport.authenticate("jwt", { session: false }), (req, res) =>
  res.json({ valid: Boolean(req.user) })
);

module.exports = router;
