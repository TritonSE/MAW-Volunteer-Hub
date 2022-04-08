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

router.get("/ics/:calendar?", (req, res) => {
  /* TODO: Can filter by the type of calendar */
  const calendar = ical({ name: "Make-a-Wish Volunteers" });
  EventModel.find()
    .then((events) => {
      events
        .filter((evt) => !req.params.calendar || req.params.calendar === evt.calendar)
        .forEach((evt) =>
          calendar.createEvent({
            start: evt.from,
            end: evt.to,
            timezone: "America/Los_Angeles",
            summary: evt.name,
            description: evt.question,
            location: evt.location,
          })
        );
      calendar.serve(res);
    })
    .catch(errorHandler(res));
});

router.put(
  "/new",
  validate(["from", "to", "name", "calendar", "number_needed", "location"], []),
  (req, res) => {
    const from = new Date(req.body.from);
    const to = new Date(req.body.to);
    const number_needed = Number.parseInt(req.body.number_needed, 10);

    if (from === "Invalid Date" || to === "Invalid Date" || Number.isNaN(number_needed)) {
      res.status(400).json({ error: "Invalid event parameters." });
      return;
    }

    EventModel.create({
      ...req.body,
      from,
      to,
      number_needed,
    })
      .then((event) => res.json({ event }))
      .catch(errorHandler(res));
  }
);

router.delete("/del/:id", validate([], ["id"]), (req, res) => {
  EventModel.deleteOne({ _id: req.params.id })
    .then(() => res.json({ success: true }))
    .catch(errorHandler(res));
});

router.patch("/upd/:id", validate([], ["id"]), (_req, _res) => {});

module.exports = router;
