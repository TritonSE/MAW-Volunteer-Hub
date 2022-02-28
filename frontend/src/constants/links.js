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
export { SITE_PAGES, API_ENDPOINTS, SIDENAV_STEPS, SIDENAV_ROUTES };
