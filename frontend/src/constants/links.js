// url links for the website pages
const SITE_PAGES = {
  HOME: "/",
  LOGIN: "/login",
  RESET: "/reset",
  WISH_GRANTING: "/wish-granting",
  PROFILE: "/profile",
  MANAGE: "/manage",
  CALENDAR: "/calendar",
  RESOURCES: "/resources",
  CONTACT: "/contact",

  SIGNOUT: "/signout",
};

const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  SIGNUP: "/auth/signup",
  FORGOT: "/auth/forgot",
  RESET: "/auth/reset",
  SIGNOUT: "/auth/signout",
  TOKEN: "/auth/token",

  FILE_UPLOAD: "/file/upload",
  FILE_DISPLAY: "/file/display",
  FILE_DELETE: "/file/delete",
  FILE_UPDATE: "/file/update",
  FILE_SEARCH: "/file/search",
  FILE_ALL: "/file/all",

  CATEGORY_ALL: "/category/all",
  CATEGORY_ONE: "/category/one",
  CATEGORY_DELETE: "/category/delete",
  CATEGORY_CREATE: "/category/create",
  CATEGORY_UPDATE: "/category/edit",
  CATEGORY_DOWNLOAD: "/category/download",

  USER_INFO: "/user/info",
  USER_ALL: "/user/users",
  USER_VERIFY: "/user/verify",
  USER_PROMOTE: "/user/promote",
  USER_DELETE: "/user/delete",
  USER_UPDATE_PASS: "/user/updatepass",
  USER_EDIT: "/user/edit",
  USER_ACTIVATE: "/user/activate",

  PFP_GET: "/user/pfp",
  PFP_UPLOAD: "/user/pfp/upload",

  SET_ROLES: "/user/set-roles",

  ADD_EVENT: "/user/newmanual",
  EDIT_EVENT: "/user/editmanual",
  DELETE_EVENT: "/user/delmanual",
  CALENDAR_ALL: "/cal/all",
  CALENDAR_ICS: "/cal/ics",
  CALENDAR_NEW: "/cal/new",
  CALENDAR_DELETE: "/cal/del",
  CALENDAR_UPDATE: "/cal/upd",
  CALENDAR_RESPOND: "/cal/res",

  WISH_WEDNESDAY: "/wishwed/latest",
  WISH_WEDNESDAY_ADD: "/wishwed/add",

  CONTACTS: "/contacts/all",
  CONTACTS_ADD: "/contacts/add",
  CONTACTS_DELETE: "/contacts/delete",
  CONTACTS_EDIT: "/contacts/edit",
  CONTACTS_PFP_GET: "/contacts/pfp",

  MESSAGE: "/user/message",

  CONTACT_POINT_ALL: "/contactpoint/all",
  CONTACT_POINT_CREATE: "/contactpoint/create",
  CONTACT_POINT_UPDATE: "/contactpoint/edit",
};

const SIDENAV_STEPS = [
  "Wish Discovery",
  "Wish Planning",
  "Wish Boosts",
  "Wish Reveal & Celebration",
  "Wish Closeout",
];
const SIDENAV_ROUTES = [
  "wish-discovery",
  "wish-planning",
  "wish-boosts",
  "wish-reveal-celebration",
  "wish-closeout",
];

const RESOURCES_SIDENAV_STEPS = [
  "Wish Granter Refreshers",
  "Wish Policy Updates",
  "Chapter Trainings",
  "Make-A-Wish University",
  "Make-A-Wish Foundation History",
  "Other",
];

const RESOURCES_SIDENAV_ROUTES = [
  "refreshers",
  "updates",
  "trainings",
  "university",
  "history",
  "other",
];

const CONTACT_SIDENAV_STEPS = ["Board Members", "Contact Points"];

const CONTACT_SIDENAV_ROUTES = ["board", "contacts"];

const MANAGE_STEPS = ["People", "Message", "Wish Wednesday"];
const MANAGE_ROUTES = ["people", "message", "wish-wednesday"];

export {
  SITE_PAGES,
  API_ENDPOINTS,
  SIDENAV_STEPS,
  SIDENAV_ROUTES,
  MANAGE_STEPS,
  MANAGE_ROUTES,
  RESOURCES_SIDENAV_ROUTES,
  RESOURCES_SIDENAV_STEPS,
  CONTACT_SIDENAV_STEPS,
  CONTACT_SIDENAV_ROUTES,
};
