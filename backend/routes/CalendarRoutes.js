const express = require("express");
const ical = require("ical-generator");

const router = express.Router();

const EventModel = require("../models/EventModel");
const { errorHandler, validate, idParamValidator } = require("../util/RouteUtils");

router.get("/all", (req, res) =>
  EventModel.find()
    .then((events) => res.json(events))
    .catch(errorHandler(res))
);

router.get("/ics/:calendar?", (req, res) =>
  EventModel.find()
    .then((events) => {
      const calendar = ical({ name: "Make-a-Wish Volunteers" });
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
    .catch(errorHandler(res))
);

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

router.delete("/del/:id", idParamValidator(false, "event"), (req, res) =>
  EventModel.deleteOne({ _id: req.params.id })
    .then(() => res.json({ success: true }))
    .catch(errorHandler(res))
);

router.patch("/upd/:id", idParamValidator(false, "event"), (req, _res) => {
  /* TODO */
});

router.post("/res/:id", validate(["going"], []), idParamValidator(false, "event"), (req, res) =>
  EventModel.findOne({ _id: req.params.id })
    .then((event) => {
      const tmp = event.volunteers.findIndex((vol) => vol.toString() === req.user._id);

      /*
       * Avoid a patchwork edit by removing all of the current volunteer's info
       * on the current event, then re-adding it as necessary
       */
      if (tmp > -1) {
        event.volunteers.splice(tmp, 1);
        event.guests = event.guests.filter((guest) => guest.with.toString() !== req.user._id);
        event.responses = event.responses.filter(
          (resp) => resp.volunteer.toString() !== req.user._id
        );
      }

      if (req.body.going === "true") {
        event.volunteers.push(req.user._id);

        if (req.body.guests !== "null") {
          req.body.guests.forEach((guest) =>
            event.guests.push({
              ...guest,
              with: req.user._id,
            })
          );
        }

        if (req.body.response.trim() !== "") {
          event.responses.push({
            volunteer: req.user._id,
            response: req.body.response,
          });
        }
      }

      return event.save();
    })
    .then(() => res.json({ success: true }))
    .catch(errorHandler)
);

module.exports = router;
