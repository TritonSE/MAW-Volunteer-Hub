import React, { useState } from "react";
import { SITE_PAGES } from "../constants/links";
import { NavLink } from "react-router-dom";
import "../styles/NavBar.css";

const PAGES = {
    "Wish Granting": SITE_PAGES.WISH_GRANTING,
    "Manage": SITE_PAGES.MANAGE,
    // "Calendar": SITE_PAGES.PROFILE,
    // "Additional Resources": SITE_PAGES.PEOPLE,  
    // "Contact": SITE_PAGES.LOGIN,   
};

function NavBar() {

    const [dropdown, setDropdown] = useState(false);

    const signout = () => {};


    return (

        <nav className="container">

        <ul className="navlist">

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