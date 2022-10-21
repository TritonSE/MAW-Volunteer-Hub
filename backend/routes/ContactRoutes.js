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

router.patch("/edit/:id", idParamValidator(), (req, res) => {
  Contact.findById(req.params.id)
    .then((contact) => {
      Object.assign(contact, {
        name: req.body.updated_name ? req.body.updated_name : contact.name,
        position: req.body.updated_position ? req.body.updated_position : contact.position,
        organization: req.body.updated_org ? req.body.updated_org : contact.organization,
        email: req.body.updated_email ? req.body.updated_email : contact.email,
        phone: req.body.updated_phone ? req.body.updated_phone : contact.phone,
      });
      contact.save();
    })
    .then(() => res.json({ success: true }))
    .catch(errorHandler(res));
});

module.exports = router;
