const express = require("express");
const ical = require("ical-generator");

const router = express.Router();

const EventModel = require("../models/EventModel");
const { errorHandler, validate, idParamValidator } = require("../util/RouteUtils");
const log = require("../util/Logger");

router.get("/all", (req, res) =>
  EventModel.find()
    .populate("volunteers")
    .populate({
      path: "guests",
      populate: {
        path: "with",
        model: "user",
      },
    })
    .populate({
      path: "responses",
      populate: {
        path: "volunteer",
        model: "user",
      },
    })
    .then((events) => {
      res.json(events);
      return EventModel.updateMany(
        {
          to: {
            $lte: new Date(),
          },
        },
        {
          completed: true,
        }
      );
    })
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
  validate(["from", "to", "name", "calendars", "number_needed", "location"], []),
  (req, res) =>
    EventModel.create(req.body)
      .then((event) => res.json({ event }))
      .catch(errorHandler(res))
);

router.delete("/del/:id", idParamValidator(false, "event"), (req, res) =>
  EventModel.findByIdAndDelete(req.params.id)
    .then(() => res.json({ success: true }))
    .catch(errorHandler(res))
);

router.patch("/upd/:id", idParamValidator(false, "event"), (req, res) =>
  EventModel.findById(req.params.id)
    .populate("volunteers")
    .populate({
      path: "guests",
      populate: {
        path: "with",
        model: "user",
      },
    })
    .populate({
      path: "responses",
      populate: {
        path: "volunteer",
        model: "user",
      },
    })
    .then((event) => {
      /*
       * Note: mongoose strict mode is enabled by default, meaning any
       *   properties passed via req.body that are not listed in the
       *   event schema will not be saved to the database
       */
      Object.entries(req.body).forEach(([key, value]) => {
        event[key] = value;
      });
      return event.save();
    })
    .then((event) => res.json({ event }))
    .catch(errorHandler(res))
);

router.post("/res/:id", validate(["going"], []), idParamValidator(false, "event"), (req, res) =>
  EventModel.findById(req.params.id)
    .then((event) => {
      const tmp = event.volunteers.findIndex((vol) => vol._id.toString() === req.user._id);

      /*
       * Avoid a patchwork edit by removing all of the current volunteer's info
       * on the current event, then re-adding it as necessary
       */
      if (tmp > -1) {
        event.volunteers.splice(tmp, 1);
        event.guests = event.guests.filter((guest) => guest.with._id.toString() !== req.user._id);
        event.responses = event.responses.filter(
          (resp) => resp.volunteer._id.toString() !== req.user._id
        );
      }

      if (req.body.going === "true") {
        event.volunteers.push(req.user._id);

        if (req.body.guests !== "null") {
          try {
            JSON.parse(req.body.guests).forEach((guest) =>
              event.guests.push({
                ...guest,
                with: req.user._id,
              })
            );
          } catch (e) {
            log.error(e);
          }
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
