const express = require("express");
const sanitizeHtml = require("sanitize-html");
const WishWedSchema = require("../models/WishWednesday");
const { validate, primaryAdminValidator, errorHandler } = require("../util/RouteUtils");

const router = express.Router();

router.post("/add/", primaryAdminValidator, validate(["message"]), (req, res) => {
  // need to sanitize html here
  const newPost = sanitizeHtml(req.body.message);

  WishWedSchema.create({
    message: newPost,
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
