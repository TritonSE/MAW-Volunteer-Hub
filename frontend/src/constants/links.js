// url links for the website pages
const SITE_PAGES = {
  HOME: "/",
  LOGIN: "/login",
  WISH_GRANTING: "/wish-granting",
  PROFILE: "/profile",
  MANAGE: "/manage",
  CALENDAR: "/calendar",

  SIGNOUT: "/signout",
};

const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  SIGNUP: "/auth/signup",
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

  USER: "/user",

  CALENDAR_ALL: "/cal/all",
  CALENDAR_ICS: "/cal/ics",
  CALENDAR_NEW: "/cal/new",
  CALENDAR_DELETE: "/cal/del",
  CALENDAR_UPDATE: "/cal/update",
};

const SIDENAV_STEPS = [
  "Wish Discovery",
  "Wish Planning",
  "Wish Enhancements",
  "Wish Reveal & Celebration",
  "Wish Closeout",
];
const SIDENAV_ROUTES = [
  "wish-discovery",
  "wish-planning",
  "wish-enhancements",
  "wish-reveal-celebration",
  "wish-closeout",
];

const MANAGE_STEPS = ["People", "Messages", "Wish Wednesday"];

const MANAGE_ROUTES = ["people", "messages", "wish-wednesday"];
export { SITE_PAGES, API_ENDPOINTS, SIDENAV_STEPS, SIDENAV_ROUTES, MANAGE_STEPS, MANAGE_ROUTES };
