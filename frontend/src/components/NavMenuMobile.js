import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { PAGES } from "../constants/pages";
import { SITE_PAGES } from "../constants/links";
import "../styles/NavMenuMobile.css";
import Search from "./Search";

function NavMenuMobile({ desktopDropdown, setDesktopDropdown }) {
  const [mobileSearch, setMobileSearch] = useState(false);

  return (
    <div className="nav-menu-mobile">
      {/* If mobile search is pressed, display Search component with added state,
      otherwise, display the logo, single search icon, and menu */}
      {mobileSearch === true ? (
        <div className="mobileSearchBarComponent">
          <Search extraAction closeModal={setMobileSearch} />
        </div>
      ) : (
        <div className="search-mobile">
          <div className="logo-container-mobile">
            <NavLink to={SITE_PAGES.MANAGE}>
              <img src="/img/maw_logo.png" alt="Make-A-Wish logo" className="maw-logo" />
            </NavLink>
          </div>

          <div>
            <button
              type="button"
              className="search-button-mobile"
              onClick={() => setMobileSearch((prevState) => !prevState)}
            >
              <img src="/img/searchbar.svg" alt="Search" className="searchbar-icon-mobile" />
            </button>
          </div>
        </div>
      )}

      <div className="dropdown-icon-mobile">
        <button
          type="button"
          className="dropdown-button-mobile"
          onClick={() => setDesktopDropdown((prevState) => !prevState)}
        >
          <img src="/img/hamburger.svg" alt="Hamburger menu dropdown" className="hamburger" />
        </button>
      </div>

      {/* Mobile dropdown, uses same state as desktop dropdown */}
      {desktopDropdown && (
        <div className="dropdown-container-mobile">
          <div className="logo-and-exit-mobile">
            <img src="/img/maw_logo.png" alt="Make-A-Wish logo" className="maw-logo-mobile" />
            <button
              type="button"
              className="exit-dropdown-mobile"
              onClick={() => setDesktopDropdown((prevState) => !prevState)}
            >
              <img
                src="../img/close_menu_btn.svg"
                alt="Exit Dropdown Menu"
                className="close-menu-btn-mobile"
              />
            </button>
          </div>

          <hr className="separator-mobile" />

          <div className="pages-container-mobile">
            {Object.entries(PAGES).map(([page, route]) => (
              <NavLink
                key={route}
                className="page-links-mobile"
                activeClassName="underline-mobile"
                to={route}
                onClick={() => setDesktopDropdown((prevState) => !prevState)}
              >
                {page}
              </NavLink>
            ))}
          </div>

          <hr className="separator-mobile" />

          <NavLink
            className="view-profile-link-mobile"
            to={SITE_PAGES.PROFILE}
            onClick={() => setDesktopDropdown((prevState) => !prevState)}
          >
            View your profile
          </NavLink>
          <NavLink
            className="signout-link-mobile"
            to={SITE_PAGES.LOGIN}
            onClick={() => setDesktopDropdown((prevState) => !prevState)}
          >
            <span>Sign Out</span>
            <img
              src="/img/signout_icon_white.svg"
              alt="Sign out icon"
              className="signout-icon-mobile"
            />
          </NavLink>
        </div>
      )}
    </div>
  );
}

export default NavMenuMobile;
