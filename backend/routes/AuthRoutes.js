/* eslint consistent-return: "warn" */

const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Sign up route
router.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  async (req, res, next) =>
    res.json({
      message: "Signup successful",
      user: req.user,
    })
);

// Log In route
router.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        const error = new Error("An error occurred.");

        return next(error);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const body = { _id: user._id, email: user.email }; // sign is admin into this body
        const token = jwt.sign({ user: body }, "TOP_SECRET");

        return res.json({ token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

// Token validation route
router.post("/token", passport.authenticate("jwt", { session: false }), (req, res) =>
  res.json({ valid: Boolean(req.user) })
);

module.exports = router;
