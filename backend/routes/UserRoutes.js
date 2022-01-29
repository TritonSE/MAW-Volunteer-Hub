const express = require("express");

const router = express.Router();
const { UserModel } = require("../models/UserModel");

// temporary secure route, accessed with /users/
router.get("/secure", (req, res, next) => {
  res.json({
    message: "You made it to the secure route",
    user: req.user,
    token: req.query.secret_token,
  });
});

router.get("/users/:admin", (req, res, next) => {
  if (req.params.admin === true || req.params.admin === false){
    UserModel.find({ admin: req.params.admin }).then((user) => {
    res.json(user);
    });
  }
  else{
    return res.status(400).json({error: 'Malformed Input' });
  }
});
module.exports = router;