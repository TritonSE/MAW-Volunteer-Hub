const express = require("express");
const ical = require("ical-generator");

const router = express.Router();

const EventModel = require("../models/EventModel");
const UserModel = require("../models/UserModel");
const { errorHandler, validate, idParamValidator } = require("../util/RouteUtils");

const populate = (event) =>
  event.populate({
    path: "repetitions.$*.attendees.$*.volunteer",
    model: "user",
  });

const bulk_modify = (event, remove = false) => {
  const bulk = UserModel.collection.initializeUnorderedBulkOp();
  const op = {};
  op[remove ? "$pull" : "$addToSet"] = {
    events: event._id,
  };

  (event?.attendees ?? []).forEach(({ volunteer }) => {
    bulk.find.updateOne(
      {
        _id: volunteer,
      },
      op
    );
  });
  return event?.attendees?.length > 0 ? bulk.execute() : null;
};

router.get("/all", (req, res) =>
  populate(EventModel.find())
    .then((events) => {
      res.json(events);

      const arr = [];
      const now = new Date().getTime();
      let do_push = false;

      events.forEach((evt) => {
        Array.from(evt.repetitions.values()).forEach((rep) => {
          if (new Date(rep.date).getTime() <= now) {
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
          Array.from(evt.repetitions.values()).forEach((rep) => {
            const start = new Date(rep.date);
            const end = new Date(rep.date);
            start.setHours(evt.from.getHours(), evt.from.getHours(), 0);
            end.setHours(evt.to.getHours(), evt.to.getMinutes(), 0);

            const cal_event = calendar.createEvent({
              start,
              end,
              timezone: "America/Los_Angeles",
              summary: evt.name,
              description: evt.question,
              location: evt.location,
            });

            Array.from(rep.attendees.values()).forEach((att) => {
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
    EventModel.create(req.body)
      .then((event) => {
        res.json({ event });
        return bulk_modify(event);
      })
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
      Object.entries(req.body).forEach(([key, value]) => {
        event[key] = value;
      });

      return Promise.all([event.save(), bulk_modify(event)]);
    })
    .then(([event]) => populate(event).execPopulate())
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
        const att = {
          volunteer: req.user._id,
          guests: JSON.parse(req.body.guests ?? "[]"),
          response: (req.body.response ?? "").trim(),
        };
        let rep = event.repetitions.get(req.body.date);
        if (!rep) {
          rep = {
            attendees: new Map(),
            completed: false,
          };
        }

        if (req.body.going === "true") {
          rep.attendees.set(req.user._id, att);
        } else {
          rep.attendees.delete(req.user._id);
        }

        if (rep.attendees.size > 0) {
          event.repetitions.set(req.body.date, rep);
        } else {
          event.repetitions.delete(req.body.date);
        }

        return Promise.all([event.save(), UserModel.findById(req.user._id)]);
      })
      .then(([event, user]) => {
        if (req.body.going === "true") {
          user.events.addToSet(event._id);
        } else {
          user.events.pull(event._id);
        }
        return user.save();
      })
      .then(() => res.json({ success: true }))
      .catch(errorHandler)
);

module.exports = router;
