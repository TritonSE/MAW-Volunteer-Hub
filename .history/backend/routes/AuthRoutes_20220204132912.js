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

router.put("/:id", (req,res)=>{
  try{
      User.findById(req.params.id).then((user) => {
              Object.assign(user, {admin : true})
              user.save()
      })
  } catch{
      res.status(404).send({error: "user not found"});
  }
});

router.put("/edit", (req, res, next) => {
  editUser(req.body, req.user)
    .then((user) => {
      res.status(200).json({ user });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
