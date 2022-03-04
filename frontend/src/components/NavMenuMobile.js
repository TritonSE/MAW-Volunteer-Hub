import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { SITE_PAGES } from "../constants/links";
import { PAGES } from "../constants/pages";
import "../styles/NavMenuMobile.css";
import Search from "./Search";
import history from "../history";

/*
  Mobile NavBar Menu component, with modified dropdown navigation menu & search bar.
  Contains the states passed into it from the NavBar, to pass into the Search Bar.
  -desktopDropdown: whether the profile/menu icon dropdown was open in the desktop view
  -setDesktopDropdown: toggle the profile/menu icon dropdown 
*/
function NavMenuMobile({
  showResults,
  setShowResults,
  input,
  setInput,
  filteredFiles,
  setFilteredFiles,
  desktopDropdown,
  setDesktopDropdown,
  isAdmin,
}) {
  const [active, setActive] = useState(history.location.pathname.split("/")[1]);

  useEffect(
    () =>
      history.listen((e) => {
        setActive(e.location.pathname.split("/")[1]);
      }),
    []
  );

  return (
    <div className="nav-menu-mobile">
      {/* If mobile search is pressed, display Search component with added state,
      otherwise, display the logo, single search icon, and menu */}
      {showResults === true ? (
        <div className="mobileSearchBarComponent">
          <Search
            showResults={showResults}
            setShowResults={setShowResults}
            input={input}
            setInput={setInput}
            filteredFiles={filteredFiles}
            setFilteredFiles={setFilteredFiles}
          />
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
              onClick={() => setShowResults((prevState) => !prevState)}
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
            {Object.entries(PAGES).map(([page, { route, needs_admin }]) =>
              (needs_admin && isAdmin) || !needs_admin ? (
                <NavLink
                  key={route}
                  className={`page-links-mobile ${
                    active.trim() !== "" && route.indexOf(active) > -1 ? "underline-mobile" : ""
                  }`}
                  to={route}
                >
                  {page}
                </NavLink>
              ) : null
            )}
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
