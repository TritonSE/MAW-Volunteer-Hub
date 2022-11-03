/* 
    Pages for the site, to display in the navbar and its mobile dropdown.
    If adding more pages, adjust Page Links media query in NavBar.css
*/
import { SITE_PAGES, SIDENAV_ROUTES, RESOURCES_SIDENAV_ROUTES } from "./links";

export const PAGES = {
  Manage: {
    route: SITE_PAGES.MANAGE,
    needs_admin: true,
  },
  Calendar: {
    route: SITE_PAGES.CALENDAR,
    needs_admin: false,
  },
  "Wish Granting": {
    route: `${SITE_PAGES.WISH_GRANTING}/${SIDENAV_ROUTES[0]}`,
    needs_admin: false,
  },
  "Additional Resources": {
    route: `${SITE_PAGES.RESOURCES}/${RESOURCES_SIDENAV_ROUTES[0]}`,
    needs_admin: false,
  },
};
