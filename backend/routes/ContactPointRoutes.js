const express = require("express");
const mongoose = require("mongoose");

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

// Finds the ContactPoint Card and updates everything.
router.put("/edit/:id", (req, res) =>
  ContactPointCard.findById(mongoose.Types.ObjectId(req.params.id))
    .then((contactCard) =>
      contactCard
        .updateOne({
          description: req.body.description,
          contacts: JSON.parse(req.body.contacts).map((contact) => contact),
        })
        .then(() => res.json({ success: true }))
    )
    .catch(errorHandler(res))
);

module.exports = router;
