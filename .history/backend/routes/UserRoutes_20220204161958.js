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

router.get("/admin", async (req, res, next) => {
  console.log(req.query.admin);
  if (req.query.admin){
    console.log("go through with route");
    const r = UserModel.find({ admin: req.query.admin });
    console.log(r);
    return res.status(200).json({});
   /* UserModel.find({ admin: req.query.admin })
    .then((user) => {
      console.log(user);
      return res.json({ user });
    }).catch(() => {
      console.log("CATCH");
    })*/
  }
  else {
    return res.status(400).json({error: 'Malformed Input' });
  }
});

router.get("/user_id", (req, res, next) => {
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

router.get("/trial", (req, res, next) => {
  getUsers(req.query)
    .then((users) => {
      res.status(200).json({ users });
    })
    .catch((err) => {
      next(err);
    });
}); 

router.get("/id", (req, res) => {
  User.find({user_id: req.params.user_id}, {"name" : 1, "_id": 0, "email": 1, "profilePicture": 1, "roles": 1, "joinDate": 1}).then((user)=>{
      res.json(user)
  })
}); 

module.exports = router;
