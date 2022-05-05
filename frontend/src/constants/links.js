// url links for the website pages
const SITE_PAGES = {
  HOME: "/",
  LOGIN: "/login",
  WISH_GRANTING: "/wish-granting",
  PROFILE: "/profile",
  MANAGE: "/manage",

  SIGNOUT: "/signout",
};

const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  SIGNUP: "/auth/signup",
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

  PFP_GET: "/user/pfp",
  PFP_UPLOAD: "/user/pfp/upload",

  WISH_WEDNESDAY: "/wishwed/latest",
  WISH_WEDNESDAY_ADD: "/wishwed/add",
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

// re add message when completed
// const MANAGE_STEPS = ["People", "Message", "Wish Wednesday"];
// const MANAGE_ROUTES = ["people", "messages", "wish-wednesday"];

const MANAGE_STEPS = ["People", "Wish Wednesday"];
const MANAGE_ROUTES = ["people", "wish-wednesday"];

export { SITE_PAGES, API_ENDPOINTS, SIDENAV_STEPS, SIDENAV_ROUTES, MANAGE_STEPS, MANAGE_ROUTES };
