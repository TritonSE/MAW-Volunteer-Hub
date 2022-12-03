const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");

const ManualEventSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  title: {
    type: String,
    required: true,
    minlength: 1,
  },
  hours: {
    type: Number,
    required: true,
    validate: [
      (num) => !Number.isNaN(Number.parseInt(num, 10)) && num >= 0,
      "Event must have a valid duration.",
    ],
  },
});

const UserSchema = new mongoose.Schema(
  {
    // to make sure the user is a part of make-a-wish
    name: {
      type: String,
      // required: true,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    profilePictureModified: {
      type: Date,
      default: new Date(0),
    },
    email: {
      type: String,
      required: true,
      unique: true,
      uniqueCaseInsensitive: true,
      match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,24})+$/,
    },
    // Integer value. 0 = regular user, 1 = secondary admin, 2 = primary admin, >= 3 is regular user
    admin: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: [String],
    },
    joinDate: {
      type: Date,
      // required: true
    },
    resetCode: {
      type: String,
      default: "",
    },
    resetDate: {
      type: Date,
      default: new Date(0),
    },
    hours: {
      type: Number,
      defualt: 0,
    },
    /**
     * EVENTS
     */
    events: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "event",
      },
    ],
    manualEvents: {
      type: [ManualEventSchema],
      default: [],
    },
  },
  { timestamps: true }
);

UserSchema.virtual("verified").get(function check_verify() {
  return this.roles.length > 0 || this.admin > 0;
});

UserSchema.virtual("calc_hours").get(function calculate_hours() {
  const events = this.events;
  let total_hours = 0;

  let evt_hours = 0;

  events.forEach((evt) => {
    Array.from(evt.repetitions.entries()).forEach(([date, rep]) => {
      const monthLookup = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const d = date.split(" ");
      const month = monthLookup.indexOf(d[1]);
      const day = d[2];
      const year = d[3];

      const evt_date = new Date(year, month, day, 11, 59, 59, 59); // set event complete time to 11:59:59:59 on every date

      const now = Date.now();

      const attendees_map = rep.attendees.toJSON();

      if (evt_date <= now && this._id in attendees_map) {
        const hours = (evt.to - evt.from) / 3.6e6; // convert ms to hours
        evt_hours += hours;
      }
    });
  });

  const manualEvents = this.manualEvents;
  let manual_hours = 0;
  manualEvents.forEach((evt) => {
    manual_hours += evt.hours;
  });

  total_hours += evt_hours;
  total_hours += manual_hours;

  return total_hours;
});

UserSchema.pre("save", async function save(next) {
  if (this.password && this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

UserSchema.methods.isValidPassword = async function isValidPassword(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.set("toJSON", {
  transform(doc, obj) {
    const ret = { ...obj };
    delete ret.password;
    return ret;
  },
});

UserSchema.plugin(uniqueValidator);

const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;
