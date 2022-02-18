const express = require("express");
const mongoose = require('mongoose');

const router = express.Router();

const UserModel = require("../models/UserModel");
const { idOfCurrentUser } = require("../util/userUtil");
// temporary secure route, accessed with /users/

router.get("/secure", (req, res, next) =>
  res.json({
    message: "You made it to the secure route",
    user: req.user,
    token: req.query.secret_token,
  })
);

function validateIdParam(req, res) {
  if(!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).send("Invalid user id passed into user route");
  }
}
// if current user is not an admin, then sends a 401 unauthorized
async function checkCurrentUserIsAdmin(req, res, next) {
  const currentUserId = idOfCurrentUser(req);
  const users = await UserModel.findById(currentUserId, { admin: 1 }, 
    function(err, user) {
      if(err) { next(err); }

      if(!user) {
        res.status(500).send("JWT expired");
      } else if(!user.admin) {
        res.status(401).send("Current user is not an admin");
      } else {
        next();
      }
    }
  );
}






router.get("/users", (req, res, next) => {
  // console.log(req.query?.admin);
  if (req.query.admin) {
    try {
      UserModel.find({ admin: req.query.admin })
      .then((users) => res.status(200).json({users})); // return users found
    } catch (e) {
      console.log("error");
      console.log(e);
      next(e);
    }
  } else {
    // prevent route from hanging if no query param passed in
    res.status(400).send("No query param passed in to users route");
  }
});


// Get user by id - Will return an object with only the user profile information
router.get("/:id", (req, res, next) => {
  // check if there is an id param and that it is a valid id
  validateIdParam(req, res);

  UserModel.findById(
    req.params.id,
    { name: 1, _id: 0, email: 1, profilePicture: 1, roles: 1, joinDate: 1 },
    function (err, user) {
      if(err) { next(err); }

      if(!user) { // checks if a user was found with id
        res.status(404).send("No user found with provided id");
      } else {
        res.status(200).json(user);
      }
    }
  );
});

// finds user by id then verifies user
router.put("/verify/:id", (req, res, next) => {
  validateIdParam(req, res);

  checkCurrentUserIsAdmin(req, res, 
    () => {
      UserModel.findByIdAndUpdate(req.params.id, { verified: true })
      .then((user) => res.status(200).send())
      .catch((err) => {
        next(err);
      });
    }
  );
});

// finds user by id then updates user to admin (can only be done byan admin)
router.put("/promoteadmin/:id", async (req, res, next) => {
  validateIdParam(req);

  checkCurrentUserIsAdmin(req, res,
    () => {
      UserModel.findByIdAndUpdate(req.params.id, { admin: true })
      .then((user) => res.status(200).send())
      .catch((err) => {
        next(err);
      });
    }
  );
});

// edits user information
// can only be done by an admin or a logged-in user if they are the same as the user who's info is being editted)
router.put("/edit/:id", async (req, res, next) => {
  validateIdParam(req);
  const userId = idOfCurrentUser(req);

  // we only want the user to be able to update these pieces of their profile
  const sanitizedBody = {
    name: req.body.name,
    email: req.body.email,
    profilePicture: req.body.profilePicture
  }

  // function that updates user info based on sanitized body
  const updateInfo = () => {
    try {
      UserModel.findByIdAndUpdate({ _id: req.params.id }, { $set: sanitizedBody }).then((user) => {
        if(user) {
          res.status(200).json(user);
        } else {
          res.status(400).send();
        }
      });
    } catch (err) {
      next(err);
    }
  }
  
  // if user is current user, or if current user is an admin
  if(userId == req.params.id) {
    updateInfo();
  } else {
    checkCurrentUserIsAdmin(req, res, updateInfo);
  }
});

module.exports = router;
