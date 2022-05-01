const express = require("express");
const WishWedSchema = require("../models/WishWednesday");
const { validate, adminValidator, errorHandler } = require("../util/RouteUtils");

const router = express.Router();

router.post("/add/", adminValidator, validate(["message"]), async (req, res) => {
  WishWedSchema.create({
    Message: req.body.message,
  })
    .then(res.json({ result: "success" }))
    .catch(errorHandler(res));
});

router.get("/latest/", adminValidator, (req, res) => {
  WishWedSchema.find({})
    .sort({ _id: -1 })
    .limit(2)
    .then((doc) => res.json(doc))
    .catch(errorHandler(res));
});

module.exports = router;
