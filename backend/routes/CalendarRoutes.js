const express = require("express");
const ical = require("ical-generator");

const router = express.Router();

const EventModel = require("../models/EventModel");
const UserModel = require("../models/UserModel");
const { errorHandler, validate, idParamValidator, adminValidator } = require("../util/RouteUtils");

const populate = (event) =>
  event.populate({
    path: "repetitions.$*.attendees.$*.volunteer",
    model: "user",
  });

const bulk_modify = (event, remove = false) => {
  const atts = [];
  const op = {};
  op[remove ? "$pull" : "$addToSet"] = {
    events: event._id,
  };

  Array.from(event.repetitions.values()).forEach((rep) => {
    atts.push(...Array.from(rep.attendees.values()).map((att) => att.volunteer));
  });

  return UserModel.updateMany(
    {
      _id: {
        $in: atts,
      },
    },
    op,
    {
      multi: true,
    }
  );
};

router.get("/all", (req, res) =>
  Promise.all([UserModel.findById(req.user._id), populate(EventModel.find())])
    .then(([user, events]) => {
      res.json(
        events.filter(
          (ev) => user.admin > 0 || user.roles.some((role) => ev.calendars.includes(role))
        )
      );

      const arr = [];
      let do_push = false;

      events.forEach((evt) => {
        Array.from(evt.repetitions.values()).forEach((rep) => {
          if (new Date(rep.date).getTime() <= Date.now()) {
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
  Promise.all([UserModel.findById(req.user._id), populate(EventModel.find())])
    .then(([user, events]) => {
      const calendar = ical({ name: `Make-a-Wish ${req.params.calendar ?? "Calendar"}` });
      events
        .filter((evt) => {
          if (user.admin === 0 && !user.roles.some((role) => evt.calendars.includes(role))) {
            return false;
          }

          return !req.params.calendar || evt.calendars.includes(req.params.calendar);
        })
        .forEach((evt) => {
          Array.from(evt.repetitions.entries()).forEach(([date, rep]) => {
            const start = new Date(date);
            const end = new Date(date);
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
                  name: `${guest.name} (${guest.relation} of ${att.volunteer.name})`,
                  email: att.volunteer.email /* TODO: This is a required field by ical-generator */,
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
  adminValidator,
  validate(["from", "to", "name", "calendars", "number_needed", "location"], []),
  (req, res) =>
    EventModel.create(req.body)
      .then((event) => {
        res.json({ event });
        return bulk_modify(event);
      })
      .catch(errorHandler(res))
);

router.delete("/del/:id", idParamValidator(false, "event"), adminValidator, (req, res) =>
  EventModel.findByIdAndDelete(req.params.id)
    .then((event) => {
      res.json({ success: true });
      return bulk_modify(event, true);
    })
    .catch(errorHandler(res))
);

router.patch("/upd/:id", idParamValidator(false, "event"), adminValidator, (req, res) =>
  populate(EventModel.findById(req.params.id))
    .then((event) => Promise.all([event, bulk_modify(event, true)]))
    .then(([event]) => {
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
    Promise.all([UserModel.findById(req.user._id), EventModel.findById(req.params.id)])
      .then(([user, event]) => {
        if (!user.roles.some((role) => event.calendars.includes(role))) {
          res.status(401).json({ error: "Event is not part of user's calendar." });
        }

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
          user.events.addToSet(event._id);
        } else {
          rep.attendees.delete(req.user._id);
          user.events.pull(event._id);
        }

        if (rep.attendees.size > 0) {
          event.repetitions.set(req.body.date, rep);
        } else {
          event.repetitions.delete(req.body.date);
        }

        return Promise.all([user.save(), event.save()]);
      })
      .then(() => res.json({ success: true }))
      .catch(errorHandler)
);

module.exports = router;
