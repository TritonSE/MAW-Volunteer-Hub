const express = require("express");

const ContactPointCard = require("../models/ContactPointModel");
const { validate, adminValidator, idParamValidator, errorHandler } = require("../util/RouteUtils");
const { deleteFileAWS, getObject } = require("../util/S3Util");

const router = express.Router();

router.get("/all", (req, res) =>
  ContactPointCard.find()
    .then((contactCard) => {
      res.json(contactCard);
    })
    .catch(errorHandler(res))
);

router.post("/create", (req, res) =>
  ContactPointCard.create({
    description: req.body.description,
    contacts: req.body.contacts,
  })
    .then(() => res.json({ success: true }))
    .catch(errorHandler(res))
);

// WIP: Not correct. Contact card can't just updateOne like this
router.patch("/edit", (req, res) =>
  ContactPointCard.findById(req.params.id)
    .then((contactCard) =>
      contactCard
        .updateOne({ _id: req.params.field }, req.params.newValue)
        .then(() => res.json({ success: true }))
    )
    .catch(errorHandler(res))
);

module.exports = router;
