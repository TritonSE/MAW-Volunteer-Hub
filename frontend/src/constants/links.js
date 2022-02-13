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

const MANAGE_STEPS = ["People"];

const MANAGE_ROUTES = ["people"];
export { SITE_PAGES, API_ENDPOINTS, SIDENAV_STEPS, SIDENAV_ROUTES, MANAGE_STEPS, MANAGE_ROUTES };
