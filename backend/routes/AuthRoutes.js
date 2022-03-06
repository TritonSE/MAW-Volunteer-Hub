const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const config = require("../config");
const log = require("../util/Logger");
const UserModel = require("../models/UserModel");

const router = express.Router();

// Sign up route
router.post("/signup", passport.authenticate("signup", { session: false }), (req, res) =>
  res.json({
    message: "Signup successful",
    user: req.user,
  })
);

// Log In route
router.post("/login", (req, res, next) =>
  passport.authenticate("login", (err, user) => {
    if (err || !user) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    req.login(user, { session: false }, (error) => {
      if (error) {
        log.error(error);
        res.status(500).json({ error: "Internal server error." });
        return;
      }

      res.json({
        token: jwt.sign(
          {
            user: {
              _id: user._id,
              email: user.email,
            },
          },
          config.auth.jwt_secret
        ),
        admin: user.admin,
      });
    });
  })(req, res, next)
);

// Token validation route
router.post("/token", passport.authenticate("jwt", { session: false }), (req, res) => {
  UserModel.findById((req.user ?? {})._id)
    .then((user) => res.json({ valid: Boolean(user) && Boolean(req.user), admin: user.admin }))
    .catch(() => res.json({ valid: false, admin: false }));
});

module.exports = router;
