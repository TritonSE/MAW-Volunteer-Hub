const express = require("express");
const ical = require("ical-generator");

const router = express.Router();

const EventModel = require("../models/EventModel");
const { errorHandler, validate } = require("../util/RouteUtils");

router.get("/all", (_req, res) => {
  EventModel.find()
    .then((events) => res.json(events))
    .catch(errorHandler(res));
});

router.get("/ics", (_req, res) => {
  const calendar = ical({ name: "Make-a-Wish Volunteers" });
  EventModel.find()
    .then((events) => {
      events.forEach((evt) => calendar.createEvent(evt));
      calendar.serve(res);
    })
    .catch(errorHandler(res));
});

router.put("/new", validate(["from", "to", "name"], []), (req, res) => {
  const from = new Date(req.body.from);
  const to = new Date(req.body.to);

  if (from === "Invalid Date" || to === "Invalid Date") {
    res.status(400).json({ error: "Invalid event dates." });
    return;
  }

  EventModel.create({
    from: new Date(req.body.from),
    to: new Date(req.body.to),
    name: req.body.name,
  })
    .then(() => res.json({ success: true }))
    .catch(errorHandler(res));
});

router.delete("/del/:id", validate([], ["id"]), (req, res) => {
  EventModel.deleteOne({ _id: req.params.id })
    .then(() => res.json({ success: true }))
    .catch(errorHandler(res));
});

router.patch("/update/:id", validate([], ["id"]), (_req, _res) => {});

module.exports = router;
