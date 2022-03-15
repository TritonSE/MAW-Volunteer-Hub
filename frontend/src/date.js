/**
 * Date utility functions and constants
 */
const TODAY = new Date();

const SATURDAY = 6;

const DAYS_OF_WEEK = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

const SHORT_MONTHS = [
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

const LONG_MONTHS = [
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
];

const MINUTE_IN_MS = 60 * 1000;
const HOUR_IN_MS = MINUTE_IN_MS * 60;
const DAY_IN_MS = HOUR_IN_MS * 24;

const walk_month = (date, amt = 1) => {
  const out = new Date(date);
  out.setMonth(out.getMonth() + amt);
  return out;
};
const walk_day = (date, amt = 1) => {
  const out = new Date(date);
  out.setDate(out.getDate() + amt);
  return out;
};
const walk_hour = (date, amt = 1) => {
  const out = new Date(date);
  out.setHours(out.getHours() + amt);
  return out;
};

const first_of_month = (date) => {
  const out = new Date(date);
  out.setDate(1);
  return out;
};
const first_of_week = (date) => {
  const out = new Date(date);
  out.setDate(out.getDate() - out.getDay());
  return out;
};
const last_of_week = (date) => {
  const out = new Date(date);
  out.setDate(out.getDate() + 6);
  return out;
};

const is_within_week = (wk, day) => {
  const first = new Date(wk);
  first.setDate(first.getDate() - first.getDay());
  first.setHours(0, 0, 0);

  const last = new Date(first);
  last.setDate(last.getDate() + 6);
  last.setHours(11, 59, 59);

  return day >= first && day <= last;
};

const compare_dates = (a, b) =>
  a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getYear() === b.getYear();
const compare_times = (a, b) =>
  a.getHours() === b.getHours() &&
  a.getMinutes() === b.getMinutes() &&
  a.getSeconds() === b.getSeconds();

const difference = (a, b) =>
  (a.getHours() - b.getHours()) * HOUR_IN_MS + (a.getMinutes() - b.getMinutes()) * MINUTE_IN_MS;
const dates_overlap = (a, b) => a.from <= b.to && a.to >= b.from;

const format_period = (hr) => (hr < 12 ? "AM" : "PM");
const format_hour = (hr, with_period = true) => {
  const period = format_period(hr);
  let hr_adj;

  if (hr === 0) {
    hr_adj = 12;
  } else if (hr <= 12) {
    hr_adj = hr;
  } else {
    hr_adj = hr - 12;
  }

  return `${hr_adj}${with_period ? " " + period : ""}`;
};
const format_time = (d, twelve_hour = false, with_period = false, force_pad = false) => {
  if (!d) return "";

  let hr_str = twelve_hour ? format_hour(d.getHours(), false) : d.getHours();
  if (force_pad) hr_str = hr_str.toString().padStart(2, "0");

  const min_str =
    d.getMinutes() > 0 || force_pad ? ":" + d.getMinutes().toString().padStart(2, "0") : "";
  const pd_str = twelve_hour && with_period ? " " + format_period(d.getHours()) : "";

  return hr_str + min_str + pd_str;
};
const format_range = (a, b, twelve_hour = false) => {
  const same_period =
    (a.getHours() < 12 && b.getHours() < 12) || (a.getHours() >= 12 && b.getHours() >= 12);
  return `${format_time(a, twelve_hour, !same_period)} – ${format_time(b, twelve_hour, true)}`;
};
const format_ymd = (d) => {
  if (!d) return "";
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d
    .getDate()
    .toString()
    .padStart(2, "0")}`;
};

const copy_ymd = (date, ymd) => {
  const tmp = new Date(ymd);
  const cpy = new Date(date);
  cpy.setFullYear(tmp.getFullYear());
  cpy.setMonth(tmp.getMonth());
  cpy.setDate(tmp.getDate());
  return cpy;
};
const copy_time = (date, time) => {
  const tmp = new Date(time);
  const cpy = new Date(date);
  cpy.setHours(tmp.getHours());
  cpy.setMinutes(tmp.getMinutes());
  return cpy;
};

export default {
  /*
   * UTILITIES
   */
  walk_month,
  walk_day,
  walk_hour,

  first_of_month,
  first_of_week,
  last_of_week,

  is_within_week,

  compare_dates,
  compare_times,

  difference,

  dates_overlap,

  format_hour,
  format_time,
  format_range,
  format_ymd,

  copy_ymd,
  copy_time,

  /*
   * CONSTANTS
   */
  TODAY,

  SATURDAY,
  DAYS_OF_WEEK,
  SHORT_MONTHS,
  LONG_MONTHS,

  DAY_IN_MS,
  HOUR_IN_MS,
  MINUTE_IN_MS,
};
