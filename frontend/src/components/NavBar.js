import React, { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import Modal from "react-modal";
import { SITE_PAGES, API_ENDPOINTS } from "../constants/links";
import { PAGES } from "../constants/pages";
import Search from "./Search";
import history from "../history";
import "../styles/NavBar.css";
import NavMenuMobile from "./NavMenuMobile";
import { CurrentUser } from "./Contexts";

/*
    NavBar component, which is at the top of each page and provides links to navigate between each page. 
    Also contains the file search bar and the account menu to go to the profile page or sign out.
*/
function NavBar() {
  // state for the profile dropdown
  const [dropdown, setDropdown] = useState(false);

  /* 
    States for the search bar 
    -showResults: whether the search results modal is displayed or not
    -input: text that user inputs into the search bar
    -filterdFiles: list of files filtered by input

    Storing states in main NavBar component since there are 2 instances of Search:
    1 for the desktop view and 1 for the mobile view

    Have to pass these states into the Search in this file, which is the desktop search instance  &
    NavMenuMobile, which contains the mobile Search instance so that the Search Bar input, results,
    and modal are consistent & responsive across both views.
  */
  const [showResults, setShowResults] = useState(false);
  const [input, setInput] = useState("");
  const [filteredFiles, setFilteredFiles] = useState([]);

  const [currentUser] = useContext(CurrentUser);

  const [active, setActive] = useState(history.location.pathname.split("/")[1]);

  useEffect(
    () =>
      history.listen((e) => {
        setActive(e.location.pathname.split("/")[1]);
      }),
    []
  );

  return (
    <nav className="container">
      <ul className="navlist">
        {/* Container for Logo and page links */}
        <li className="logo-and-pages">
          <div className="logo-container">
            <NavLink to={SITE_PAGES.HOME}>
              <img src="/img/maw_logo.png" alt="Make-A-Wish logo" className="maw-logo" />
            </NavLink>
          </div>

          <div className="pages-container">
            {Object.entries(PAGES).map(([page, { route, needs_admin }]) =>
              (needs_admin && currentUser && currentUser.admin) || !needs_admin ? (
                <NavLink
                  key={route}
                  className={`page-links ${
                    active.trim() !== "" && route.indexOf(active) > -1 ? "underline" : ""
                  }`}
                  to={route}
                >
                  {page}
                </NavLink>
              ) : null
            )}
          </div>
        </li>

        {/* Container for search bar and account menu, and the mobile NavBar display */}
        <li className="search-and-profile">
          <div className="desktopSearchBarComponent">
            <Search
              showResults={showResults}
              setShowResults={setShowResults}
              input={input}
              setInput={setInput}
              filteredFiles={filteredFiles}
              setFilteredFiles={setFilteredFiles}
            />
          </div>
          <NavMenuMobile
            showResults={showResults}
            setShowResults={setShowResults}
            input={input}
            setInput={setInput}
            filteredFiles={filteredFiles}
            setFilteredFiles={setFilteredFiles}
            desktopDropdown={dropdown}
            setDesktopDropdown={setDropdown}
          />

          <div className="profile-container">
            <div className="profile-icon">
              <NavLink className="account-button" to={SITE_PAGES.PROFILE}>
                <img
                  src={
                    currentUser && currentUser._id
                      ? `${API_ENDPOINTS.PFP_GET}/${currentUser._id}/${new Date(
                          currentUser.profilePictureModified
                        ).getTime()}`
                      : ""
                  }
                  alt="Profile Icon"
                  className="account-icon"
                />
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
                to={`${SITE_PAGES.PROFILE}/`}
                onClick={() => setDropdown((prevState) => !prevState)}
              >
                View your profile
              </NavLink>
              <NavLink
                className="signout-link"
                to={SITE_PAGES.SIGNOUT}
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
