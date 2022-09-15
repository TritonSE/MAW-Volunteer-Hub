const express = require("express");
const {
  validate,
  idParamValidator,
  adminValidator,
  errorHandler,
  primaryAdminValidator,
} = require("../util/RouteUtils");
const Contact = require("../models/ContactModel");

const router = express.Router();

router.post(
  "/add",
  validate(["name", "phone", "position", "organization", "email"]),
  (req, res) => {
    Contact.create({
      name: req.body.name,
      position: req.body.position,
      organization: req.body.organization,
      email: req.body.email,
      phone: req.body.phone,
    })
      .then(() => res.json({ success: true }))
      .catch(errorHandler(res));
  }
);

router.get("/all", (req, res) => {
  Contact.find()
    .then((users) => res.json({ users }))
    .catch(errorHandler(res));
});

router.delete("/delete/:id", idParamValidator(), (req, res) =>
  Contact.deleteOne({ _id: req.params.id })
    .then(() => res.json({ success: true }))
    .catch(errorHandler(res))
);

module.exports = router;
