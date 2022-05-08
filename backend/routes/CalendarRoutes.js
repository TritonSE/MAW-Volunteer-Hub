const express = require("express");
const ical = require("ical-generator");

const router = express.Router();

const EventModel = require("../models/EventModel");
const { errorHandler, validate, idParamValidator } = require("../util/RouteUtils");

const sanitize = (body) => {
  try {
    const out = body;
    if (body.calendars) {
      out.calendars = JSON.parse(body.calendars);
    }
    if (body.repetitions) {
      out.repetitions = JSON.parse(body.repetitions);
      out.repetitions.forEach((rep) => {
        rep.attendees = JSON.parse(rep.attendees);
        rep.attendees.forEach((vol) => {
          vol.guests = JSON.parse(vol.guests);
        });
      });
    }
    return out;
  } catch (e) {
    return null;
  }
};

const populate = (event) =>
  event.populate({
    path: "repetitions.attendees.volunteer",
    model: "user",
  });

router.get("/all", (req, res) =>
  populate(EventModel.find())
    .then((events) => {
      res.json(events);

      const arr = [];
      const now = new Date().getTime();
      let do_push = false;

      events.forEach((evt) => {
        evt.repetitions.forEach((rep) => {
          if (rep.date.getTime() <= now) {
            rep.completed = true;
            do_push = true;
          }
        });
        if (do_push) {
          arr.push(evt.save());
          do_push = false;
        }
      });

      return Promise.all(arr);
    })
    .catch(errorHandler(res))
);

router.get("/ics/:calendar?", (req, res) =>
  populate(EventModel.find())
    .then((events) => {
      const calendar = ical({ name: "Make-a-Wish Volunteers" });
      events
        .filter((evt) => {
          if (!req.params.calendar) return evt;

          if (Array.isArray(evt.calendar)) {
            return evt.calendar.includes(req.params.calendar);
          }
          return req.params.calendar === evt.calendar;
        })
        .forEach((evt) => {
          evt.repetitions.forEach((rep) => {
            const end = new Date(rep.date);
            end.setHours(evt.to.getHours(), evt.to.getMinutes(), 0);

            const cal_event = calendar.createEvent({
              start: rep.date,
              end,
              timezone: "America/Los_Angeles",
              summary: evt.name,
              description: evt.question,
              location: evt.location,
            });

            rep.attendees.forEach((att) => {
              cal_event.createAttendee({
                email: att.volunteer.email,
                name: att.volunteer.name,
              });
              att.guests.forEach((guest) => {
                cal_event.createAttendee({
                  with: att.volunteer.name,
                  name: guest.name,
                  relation: guest.relation,
                });
              });
            });
          });
        });
      calendar.serve(res, `${req.params.calendar ?? "Make-a-Wish"}.ics`);
    })
    .catch(errorHandler(res))
);

router.put(
  "/new",
  validate(["from", "to", "name", "calendars", "number_needed", "location"], []),
  (req, res) =>
    EventModel.create(sanitize(req.body))
      .then((event) => res.json({ event }))
      .catch(errorHandler(res))
);

router.delete("/del/:id", idParamValidator(false, "event"), (req, res) =>
  EventModel.findByIdAndDelete(req.params.id)
    .then(() => res.json({ success: true }))
    .catch(errorHandler(res))
);

router.patch("/upd/:id", idParamValidator(false, "event"), (req, res) =>
  populate(EventModel.findById(req.params.id))
    .then((event) => {
      /*
       * Note: mongoose strict mode is enabled by default, meaning any
       *   properties passed via req.body that are not listed in the
       *   event schema will not be saved to the database
       */
      Object.entries(sanitize(req.body)).forEach(([key, value]) => {
        event[key] = value;
      });
      return event.save();
    })
    .then((event) => populate(event).execPopulate())
    .then((event) => res.json({ event }))
    .catch(errorHandler(res))
);

router.post(
  "/res/:id",
  validate(["going", "date"], []),
  idParamValidator(false, "event"),
  (req, res) =>
    EventModel.findById(req.params.id)
      .then((event) => {
        const HOUR_IN_MS = 60 * 60 * 1000;
        const DAY_IN_MS = 24 * HOUR_IN_MS;
        const date = new Date(req.body.date);
        let rep_ind = event.repetitions.findIndex(
          (tmp) => Math.abs(tmp.date.getTime() - date.getTime()) < DAY_IN_MS - HOUR_IN_MS
        );
        let rep;

        if (rep_ind > -1) {
          rep = event.repetitions[rep_ind];
          const tmp = rep.attendees.findIndex(
            (att) => att.volunteer._id.toString() === req.user._id
          );

          /*
           * Avoid a patchwork edit by removing all of the current volunteer's info
           * on the current event, then re-adding it as necessary
           */
          if (tmp > -1) {
            rep.attendees.splice(tmp, 1);
          }
        } else {
          rep_ind = event.repetitions.length;
          rep = {
            date,
            attendees: [],
          };
          event.repetitions.push(rep);
        }

        return Promise.all([event.save(), rep_ind]);
      })
      .then(([event, rep_ind]) => {
        const rep = event.repetitions[rep_ind];

        if (req.body.going === "true") {
          let guests;
          try {
            guests = JSON.parse(req.body.guests);
          } catch (e) {
            guests = [];
          }
          rep.attendees.push({
            volunteer: req.user._id,
            guests,
            response: (req.body.response ?? "").trim(),
          });
        } else if (rep.attendees.length === 0) {
          event.repetitions.splice(rep_ind, 1);
        }

        return event.save();
      })
      .then(() => res.json({ success: true }))
      .catch(errorHandler)
);

module.exports = router;
