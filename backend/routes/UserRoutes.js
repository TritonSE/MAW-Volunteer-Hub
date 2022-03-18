const express = require("express");

const router = express.Router();

const UserModel = require("../models/UserModel");
const { errorHandler, idParamValidator } = require("../util/RouteUtils");
const { sanitizeUser, isAdmin } = require("../util/UserUtils");

router.get("/users", (req, res) =>
  UserModel.find({ admin: req.query.admin ?? false })
    .then((users) => res.json({ users }))
    .catch(errorHandler(res))
);

router.get("/id?", idParamValidator(true), (req, res) =>
  UserModel.findById(req.params.id ?? req.user._id)
    .then((user) => res.json({ user: sanitizeUser(user), sameUser: user._id === req.user._id }))
    .catch(errorHandler(res))
);

router.put("/verify/:id", idParamValidator(), isAdmin(), (req, res) =>
  UserModel.findByIdAndUpdate(req.params.id, { verified: true })
    .then(() => res.status(200).json({ success: true }))
    .catch(errorHandler(res))
);

router.put("/promoteadmin/:id", idParamValidator(), isAdmin(), (req, res) =>
  UserModel.findByIdAndUpdate(req.params.id, { admin: true })
    .then(() => res.status(200).json({ success: true }))
    .catch(errorHandler(res))
);

router.delete("/DeleteUser/:id", idParamValidator(), isAdmin(), (req, res) =>
  UserModel.deleteOne({ _id: req.params.id })
    .then(() => res.json({ success: true }))
    .catch(errorHandler(res))
);

router.put("/updatePassword", (req, res) =>
  UserModel.findByIdAndUpdate(req.user._id, { password: req.body.password })
    .then(() => res.json({ success: true }))
    .catch(errorHandler(res))
);

router.put("/edit/:id", idParamValidator(), (req, res) =>
  UserModel.findById(req.user._id)
    .then((user) => {
      if (req.params.id !== req.user._id && user.admin) return user;
      if (req.params.id === req.user._id) return UserModel.findById(req.params.id);
      throw new Error("Access denied.");
    })
    .then((user) => {
      Object.assign(
        user,
        req.body.name && { name: req.body.name },
        req.body.email && { email: req.body.email }
      );
      return user.save();
    })
    .catch(errorHandler(res))
);

module.exports = router;
