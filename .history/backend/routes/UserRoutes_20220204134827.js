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
route.get("/:idd", (req, res) => {
  User.find({user_id: req.params.user_id}, {"name" : 1, "_id": 0, "email": 1, "profilePicture": 1, "roles": 1, "joinDate": 1}).then((user)=>{
      res.json(user)
  })
}); 

module.exports = router;
