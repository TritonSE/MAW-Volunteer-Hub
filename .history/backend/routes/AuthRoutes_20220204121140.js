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

router.get("/users/:user_id", (req, res, next) => {
  getUser(req.params.user_id)
    .then((user) => {
      res.json({ 
        name: req.name,
        email: req.email,
        profilePicture: req.profilePicture,
        roles: req.roles,
        joinDate: req.joinDate,
      });
    })
    .catch((err) => {
      next(err);
    });
});


module.exports = router;
