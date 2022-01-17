import React, { useState } from "react";
import { SITE_PAGES } from "../constants/links";
import { NavLink } from "react-router-dom";
import "../styles/NavBar.css";

// Pages to display in the NavBar. If adding more pages, adjust Page Links media query in NavBar.css
const PAGES = {
    "Wish Granting": SITE_PAGES.WISH_GRANTING,
    "Manage": SITE_PAGES.MANAGE,
};

/*
    NavBar component, which is at the top of each page and provides links to navigate between each page. 
    Also contains the file search bar and the account menu to go to the profile page or sign out.
*/
function NavBar() {

    const [dropdown, setDropdown] = useState(false);

    const signout = () => {};


    return (

        <nav className="container">

        <ul className="navlist">

            {/* Container for Logo and page links */}
            <li className="logo-and-pages">
                <li className="logo-container">
                    <NavLink to={SITE_PAGES.MANAGE}>
                        <img src="/img/maw_logo.png" alt="Make-A-Wish logo" className="maw-logo"/>
                    </NavLink>
                </li>

                <li className="pages-container">
                    { Object.entries(PAGES).map( ([page, route]) => (
                        <NavLink className="page-links" activeClassName="underline" to={route}>{page}</NavLink>
                    ))}
                </li>
            </li>

            {/* Container for search bar and account menu */}
            <li className="search-and-profile">
                
                <form className="search-container">
                    <input className="search-input" placeholder="Search all files..."/>
                    <button className="search-button" type="submit">
                        <img src="/img/searchbar.svg" alt="Search" className="searchbar-icon"/>
                    </button>
                </form>

                <div className="profile-container">
                    <div className="profile-icon" onClick={() => setDropdown(prev => !prev)}>
                        <img src="/img/profile_icon.svg" alt="Profile Icon" className="account-icon"/>
                        <img src="/img/dropdown_icon.svg" alt="Arrow Dropdown" className="arrow-dropdown"/>
                    </div>

                    {dropdown && (
                        <div className="profile-dropdown">
                            <NavLink className="view-profile-link" to={SITE_PAGES.PROFILE}>View your profile</NavLink>
                            <NavLink className="signout-link" to={SITE_PAGES.LOGIN} onClick={() => signout()}>
                                <span>Sign Out</span>
                                <img src="/img/signout_icon.svg" alt="Sign out icon" className="signout-icon"/>
                            </NavLink>
                        </div>
                    )}

                </div>
                
            </li>

        </ul>

        </nav>

    );
}

export default NavBar;