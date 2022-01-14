/**
    Super basic navbar without any styles
 */
import React, { useState } from "react";
import { SITE_PAGES } from "../constants/links";
import { NavLink, useLocation } from "react-router-dom";
import "../styles/NavBar.css";

const PAGES = {
    "Wish Granting": SITE_PAGES.WISH_GRANTING,
    "Manage": SITE_PAGES.MANAGE,    
};

function NavBar() {

    const location = useLocation().pathname;

    const signout = () => {};

    const [dropdown, setDropdown] = useState(false);

    return (

        <nav className="container">

        <ul className="navlist">

            <li className="logo-container">
                <NavLink to={SITE_PAGES.MANAGE}>
                    <img src="/img/maw_logo.svg" alt="Make-A-Wish logo" className="maw-logo"/>
                </NavLink>
            </li>

            
            { Object.entries(PAGES).map( ([page, route]) => (
                
                <li className="page-name">
                    <NavLink className="page-links" activeClassName="underline" to={route}>{page}</NavLink>
                    {/* <div className={location === route ? "underline-shown" : "underline-hidden"}/> */}
                </li>

            ))}
            

        <li className="search-and-profile">
            <div className="search-container">
                <input className="search-input" placeholder="Search all files..."/>
                <button className="search-button" onClick={() => window.location.reload()}>
                    <img src="/img/searchbar.svg" alt="Search Bar" className="searchbar"/>
                </button>
            </div>

            <div className="profile-container">

                <div className="profile-icon" onClick={() => setDropdown(prev => !prev)}>
                    <img src="/img/profile_icon.svg" alt="Profile Icon" className="account-icon"/>
                    <img src="/img/dropdown_icon.svg" alt="Arrow Dropdown" className="arrow-dropdown"/>
                </div>

                {dropdown && (
                    <div className="profile-dropdown">
                        <div className="view-profile">
                            <NavLink className="view-profile-link" to={SITE_PAGES.PROFILE}>View your profile</NavLink>
                        </div>
                        <div onClick={() => signout()}>
                            <NavLink className="signout-link" to={SITE_PAGES.LOGIN}>
                                <span>Sign Out</span>
                                <img src="/img/signout_icon.svg" alt="Sign out icon" className="signout-icon"/>
                            </NavLink>
                        </div>
                    </div>
                )}

            </div>
            </li>

        </ul>

        </nav>

    );
}

export default NavBar;