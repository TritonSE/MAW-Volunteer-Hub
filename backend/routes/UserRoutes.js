const express = require("express");

const router = express.Router();

const Buffer = require("buffer/").Buffer;

const bcrypt = require("bcrypt");
const auth_hdr = require("./auth_header");

const AUTH_HEADER = "authorization";


const UserModel = require("../models/UserModel");

// temporary secure route, accessed with /users/

router.get("/secure", (req, res, next) =>
  res.json({
    message: "You made it to the secure route",
    user: req.user,
    token: req.query.secret_token,
  })
);

router.get("/admin", (req, res, next) => {
  console.log(req.query.admin);
  if (req.query.admin) {
    try {
      UserModel.find({ admin: req.query.admin }).then((user) => res.status(200));
    } catch (e) {
      console.log("error");
      console.log(e);
      next(e);
    }
  }
});

// Get user by id - Will return an object with only the user profile information
router.get("/id", (req, res, next) => {
  UserModel.findOne(
    { _id: req.query._id },
    { name: 1, _id: 0, email: 1, profilePicture: 1, roles: 1, joinDate: 1 }
  )
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      next(err);
    });
});

// helper function-- retrieves JWT token then parses it to get user id of logged in user
// modifed PassportJS's fromAuthHeaderWithScheme function
function idOfCurrentUser(req) {
  // retreives JWT token
  // var token;
  const auth_params = auth_hdr.parse(req.headers[AUTH_HEADER]);
  const token = auth_params.value;
  // parses JWT Token
  const base64Payload = token.split(".")[1];
  const payload = Buffer.from(base64Payload, "base64");
  const answer = JSON.parse(payload.toString());
  const userId = answer["user"]["_id"];
  return userId;
}

// finds user by id then verifies user
router.put("/VerifybyId", (req, res, next) => {
  UserModel.findOneAndUpdate({ _id: req.query._id }, { verified: true })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      next(err);
    });
});

// finds user by id then updates user to admin (can only be done byan admin)
router.put("/AdminbyId", async (req, res, next) => {
  const userId = idOfCurrentUser(req);
  const users = await UserModel.findById(userId).select("admin");
  const isAdmin = users["admin"];

  if (isAdmin === true) {
    try {
      UserModel.findOneAndUpdate({ _id: req.query._id }, { admin: true }).then((user) => {
        res.json(user);
      });
    } catch (err) {
      next(err);
    }
  }
  else{
    try {
      throw new Error('non-admin user')
    } catch (err) {
      next(err)
    }
  }
});

// finds user by id then deletes user (can only be done by an admin)
router.delete("/DeleteUser", async (req, res, next) => {
  const userId = idOfCurrentUser(req);
  const users = await UserModel.findById(userId).select("admin");
  const isAdmin = users["admin"];

  if (isAdmin === true) {
    try {
      UserModel.deleteOne({ _id: req.query._id }).then((user) => {
        res.json(user);
      });
    } catch (err) {
      next(err);
    }
  }
  else{
    try {
      throw new Error('non-admin user')
    } catch (err) {
      next(err)
    }
  }
});

// Update password route if the user id is the same as the current user's jwt id   
router.put("/updatePassword", async (req, res, next) => {
  const userId = idOfCurrentUser(req);
  const queryPassword = await bcrypt.hash(req.query.password , 10);
  if (userId === req.query._id) {
    try {
      UserModel.findOneAndUpdate({ password: queryPassword }).then((user) => {
        res.json(user);
      });
    } catch (err) {
      next(err);
    }
  }
  else{
    try {
      throw new Error('non-admin user')
    } catch (err) {
      next(err)
    }
  }
});

// edits user information
// can only be done by an admin or a logged-in user if they are the same as the user who's info is being editted)
router.put("/edits", async (req, res, next) => {
  const userId = idOfCurrentUser(req);
  console.log(userId);
  console.log(req.query._id);
  console.log(userId === req.query._id);
  const users = await UserModel.findById(userId).select("admin");
  const isAdmin = users["admin"];
  console.log(isAdmin);
  if (isAdmin === true || userId === req.query._id) {
    try {
      UserModel.findByIdAndUpdate({ _id: req.query._id }, { $set: req.body }).then((user) => {
        res.json(user);
      });
    } catch (err) {
      next(err);
    }
  }
  else{
    try {
      throw new Error('non-admin user')
    } catch (err) {
      next(err)
    }
  }
});

module.exports = router;
