import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Modal from "react-modal";
import { SITE_PAGES } from "../constants/links";
import Search from "./Search";
import "../styles/NavBar.css";

// Pages to display in the NavBar. If adding more pages, adjust Page Links media query in NavBar.css
const PAGES = {
  "Wish Granting": SITE_PAGES.WISH_GRANTING,
  Manage: SITE_PAGES.MANAGE,
};

Modal.setAppElement(document.getElementById("#root"));

/*
    NavBar component, which is at the top of each page and provides links to navigate between each page. 
    Also contains the file search bar and the account menu to go to the profile page or sign out.
*/
function NavBar() {
  const [dropdown, setDropdown] = useState(false);

  return (
    <nav className="container">
      <ul className="navlist">
        {/* Container for Logo and page links */}
        <li className="logo-and-pages">
          <div className="logo-container">
            <NavLink to={SITE_PAGES.MANAGE}>
              <img src="/img/maw_logo.png" alt="Make-A-Wish logo" className="maw-logo" />
            </NavLink>
          </div>

          <div className="pages-container">
            {Object.entries(PAGES).map(([page, route]) => (
              <NavLink key={route} className="page-links" activeClassName="underline" to={route}>
                {page}
              </NavLink>
            ))}
          </div>
        </li>

        {/* Container for search bar and account menu */}
        <li className="search-and-profile">
          <Search />

          <div className="profile-container">
            <div className="profile-icon">
              <NavLink className="account-button" to={SITE_PAGES.PROFILE}>
                <img src="/img/profile_icon.svg" alt="Profile Icon" className="account-icon" />
              </NavLink>
              <button
                className="arrow-button"
                onClick={() => setDropdown((prevState) => !prevState)}
                type="button"
              >
                <img src="/img/dropdown_icon.svg" alt="Arrow Dropdown" className="arrow-dropdown" />
              </button>
            </div>

            {/* Profile dropdown */}
            <Modal
              isOpen={dropdown}
              onRequestClose={() => setDropdown((prevState) => !prevState)}
              style={{ overlay: { backgroundColor: "transparent" } }}
              className="profile-dropdown"
              overlayClassName="profile-dropdown-overlay"
            >
              <NavLink
                className="view-profile-link"
                to={SITE_PAGES.PROFILE}
                onClick={() => setDropdown((prevState) => !prevState)}
              >
                View your profile
              </NavLink>
              <NavLink
                className="signout-link"
                to={SITE_PAGES.LOGIN}
                onClick={() => setDropdown((prevState) => !prevState)}
              >
                <span>Sign Out</span>
                <img src="/img/signout_icon.svg" alt="Sign out icon" className="signout-icon" />
              </NavLink>
            </Modal>
          </div>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
