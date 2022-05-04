const express = require("express");
const WishWedSchema = require("../models/WishWednesday");
const { validate, primaryAdminValidator, errorHandler } = require("../util/RouteUtils");

const router = express.Router();

router.post("/add/", primaryAdminValidator, validate(["message"]), (req, res) => {
  // need to sanitize html here
  WishWedSchema.create({
    message: req.body.message,
  })
    .then(res.json({ result: "success" }))
    .catch(errorHandler(res));
});

router.get("/latest", (req, res) => {
  WishWedSchema.find({})
    .sort({ createdAt: "desc" })
    .limit(1)
    .then((doc) => res.json(doc))
    .catch(errorHandler(res));
});

module.exports = router;
