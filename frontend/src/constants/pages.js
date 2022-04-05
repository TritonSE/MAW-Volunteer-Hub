/* 
    Pages for the site, to display in the navbar and its mobile dropdown.
    If adding more pages, adjust Page Links media query in NavBar.css
*/
import { SITE_PAGES, SIDENAV_ROUTES } from "./links";

export const PAGES = {
  "Wish Granting": {
    route: `${SITE_PAGES.WISH_GRANTING}/${SIDENAV_ROUTES[0]}`,
    needs_admin: false,
  },
  Manage: {
    route: SITE_PAGES.MANAGE,
    needs_admin: true,
  },
};
