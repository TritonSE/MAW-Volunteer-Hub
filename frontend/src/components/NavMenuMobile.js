import React from "react";
import { NavLink } from "react-router-dom";
import { PAGES } from "../constants/pages";
import "../styles/NavMenuMobile.css";

function NavMenuMobile({ desktopDropdown, setDesktopDropdown }) {
  return (
    <div className="nav-menu-mobile">
      <div className="mobile-search">
        <button type="button" className="search-button-mobile">
          <img src="/img/searchbar.svg" alt="Search" className="searchbar-icon-mobile" />
        </button>
      </div>

      <div className="mobile-dropdown">
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
        <div className="dropdown-container">
          <div className="logo-and-exit">
            <img src="/img/maw_logo.png" alt="Make-A-Wish logo" className="maw-logo" />
            <button
              type="button"
              className="exit-dropdown-mobile"
              onClick={() => setDesktopDropdown((prevState) => !prevState)}
            >
              <img
                src="../img/close_menu_btn.svg"
                alt="Exit Dropdown Menu"
                className="close-menu-btn"
              />
            </button>
          </div>

          <hr className="separator" />

          <div className="pages-container-mobile">
            {Object.entries(PAGES).map(([page, route]) => (
              <NavLink
                key={route}
                className="page-links-mobile"
                activeClassName="underline"
                to={route}
              >
                {page}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default NavMenuMobile;
