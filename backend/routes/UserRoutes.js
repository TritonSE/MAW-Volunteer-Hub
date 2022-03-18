const express = require("express");

const router = express.Router();

const UserModel = require("../models/UserModel");
const { validate, errorHandler, idParamValidator } = require("../util/RouteUtils");
const { sanitizeUser, isAdmin } = require("../util/UserUtils");

router.get("/users", (req, res) =>
  UserModel.find({ admin: req.query.admin ?? false })
    .then((users) => res.json({ users }))
    .catch(errorHandler(res))
);

router.get("/info/:id?", idParamValidator(true), (req, res) =>
  UserModel.findById(req.params.id ?? req.user._id)
    .then((user) =>
      res.json({
        user: sanitizeUser(user),
        sameUser: user._id.toString() === req.user._id.toString(),
      })
    )
    .catch(errorHandler(res))
);

router.put("/verify/:id", idParamValidator(), isAdmin(), (req, res) =>
  UserModel.findByIdAndUpdate(req.params.id, { verified: true })
    .then(() => res.status(200).json({ success: true }))
    .catch(errorHandler(res))
);

router.put("/promote/:id", idParamValidator(), isAdmin(), (req, res) =>
  UserModel.findByIdAndUpdate(req.params.id, { admin: true })
    .then(() => res.status(200).json({ success: true }))
    .catch(errorHandler(res))
);

router.delete("/delete/:id", idParamValidator(), isAdmin(), (req, res) =>
  UserModel.deleteOne({ _id: req.params.id })
    .then(() => res.json({ success: true }))
    .catch(errorHandler(res))
);

router.put("/updatepass", validate(["old_pass", "new_pass"], []), (req, res) =>
  UserModel.findById(req.user._id)
    .then((user) => Promise.all([user, user.isValidPassword(req.body.old_pass)]))
    .then(([user, valid]) => {
      if (!valid) {
        return Promise.all(["Incorrect current password."]);
      }
      Object.assign(user, {
        password: req.body.new_pass,
      });
      return Promise.all([false, user.save()]);
    })
    .then(([error]) => {
      if (!error) res.json({ success: true });
      else res.status(403).json({ error });
    })
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
