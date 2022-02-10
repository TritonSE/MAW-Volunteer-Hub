/* 
    Pages for the site, to display in the navbar and it's mobile dropdown.
    If adding more pages, adjust Page Links media query in NavBar.css
*/
import { SITE_PAGES, SIDENAV_ROUTES } from "./links";

export const PAGES = {
  "Wish Granting": `${SITE_PAGES.WISH_GRANTING}/${SIDENAV_ROUTES[0]}`,
  Manage: SITE_PAGES.MANAGE,
};
