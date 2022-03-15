/**
 * Date utility functions and constants
 */
export default {
  /*
   * UTILITY FUNCTIONS
   */
  walk_month: (date, amt = 1) => {
    const out = new Date(date);
    out.setMonth(out.getMonth() + amt);
    return out;
  },
  walk_day: (date, amt = 1) => {
    const out = new Date(date);
    out.setDate(out.getDate() + amt);
    return out;
  },
  walk_hour: (date, amt = 1) => {
    const out = new Date(date);
    out.setHours(out.getHours() + amt);
    return out;
  },

  first_of_month: (date) => {
    const out = new Date(date);
    out.setDate(1);
    return out;
  },
  first_of_week: (date) => {
    const out = new Date(date);
    out.setDate(out.getDate() - out.getDay());
    return out;
  },
  last_of_week: (date) => {
    const out = new Date(date);
    out.setDate(out.getDate() + 6);
    return out;
  },

  is_within_week: (wk, day) => {
    const first = new Date(wk);
    first.setDate(first.getDate() - first.getDay());
    first.setHours(0, 0, 0);

    const last = new Date(first);
    last.setDate(last.getDate() + 6);
    last.setHours(11, 59, 59);

    return day >= first && day <= last;
  },

  compare_dates: (a, b) =>
    a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getYear() === b.getYear(),
  compare_times: (a, b) =>
    a.getHours() === b.getHours() &&
    a.getMinutes() === b.getMinutes() &&
    a.getSeconds() === b.getSeconds(),

  difference: (a, b) =>
    (a.getHours() - b.getHours()) * 60 * 60 * 1000 + (a.getMinutes() - b.getMinutes()) * 60 * 1000,

  dates_overlap: (a, b) => a.from <= b.to && a.to >= b.from,

  format_hour: (hr) => {
    const period = hr < 12 ? "AM" : "PM";
    let hr_adj;

    if (hr === 0) {
      hr_adj = 12;
    } else if (hr <= 12) {
      hr_adj = hr;
    } else {
      hr_adj = hr - 12;
    }

    return `${hr_adj} ${period}`;
  },

  copy_ymd: (date, ymd) => {
    const tmp = new Date(ymd);
    const cpy = new Date(date);
    cpy.setFullYear(tmp.getFullYear());
    cpy.setMonth(tmp.getMonth());
    cpy.setDate(tmp.getDate());
    return cpy;
  },
  format_ymd: (d) => {
    if (!d) return "";
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d
      .getDate()
      .toString()
      .padStart(2, "0")}`;
  },
  copy_time: (date, time) => {
    const tmp = new Date(time);
    const cpy = new Date(date);
    cpy.setHours(tmp.getHours());
    cpy.setMinutes(tmp.getMinutes());
    return cpy;
  },
  format_time: (d, twelve_hour = false) => {
    if (!d) return "";

    const hr = d.getHours();
    let hr_adj = hr;
    if (twelve_hour) {
      if (hr === 0) hr_adj = 12;
      else if (hr > 12) hr_adj = hr - 12;
    }
    const period = hr < 12 ? " AM" : " PM";

    return `${hr_adj.toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}${
      twelve_hour ? period : ""
    }`;
  },

  /*
   * CONSTANTS
   */
  TODAY: new Date(),

  SATURDAY: 6,
  DAYS_OF_WEEK: ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"],
  SHORT_MONTHS: [
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
  ],
  LONG_MONTHS: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],

  DAY_IN_MS: 24 * 60 * 60 * 1000,
  HOUR_IN_MS: 60 * 60 * 1000,
};
