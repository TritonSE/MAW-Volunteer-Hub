/**
    Super basic navbar without any styles
 */
import React, { useState } from "react";
import { SITE_PAGES } from "../constants/links";
import { useLocation } from "react-router-dom";
import "../styles/NavBar.css";

const PAGES = {
    "Wish Granting": SITE_PAGES.WISH_GRANTING,
    "Manage": SITE_PAGES.MANAGE,    
};

export default function NavBar() {

    const location = useLocation().pathname;

    const signout = () => {};

    const [dropdown, setDropdown] = useState(false);

    return (

        <div className="container">

            <img src="/img/maw_logo.svg" alt="Make-A-Wish logo" className="maw-logo"/>


            { Object.entries(PAGES).map( ([page, route]) => (

                <div className="page-name">
                    <a className="page-links" href={route}>{page}</a>
                    <div className={location === route ? "underline-shown" : "underline-hidden"}/>
                </div>

            ))}

        
            <div className="search-container">
                <button className="search-button" onClick={() => window.location.reload()}>
                    <img src="/img/searchbar.svg" alt="Search Bar" className="searchbar"/>
                </button>
            </div>

            <div className="profile-container">

                <div className="profile-icon" onClick={()=>setDropdown(prev => !prev)}>
                    <img src="/img/profile_icon.svg" alt="Profile Icon" className="account-icon"/>
                    <img src="/img/dropdown_icon.svg" alt="Arrow Dropdown" className="arrow-dropdown"/>
                </div>

                {dropdown && (
                    <div className="profile-dropdown">
                        <div className="view-profile">
                            <a className="view-profile-link" href={SITE_PAGES.PROFILE}>View your profile</a>
                        </div>
                        <div className="signout">
                            <a className="signout-link" href={SITE_PAGES.LOGIN} onClick={signout()}>Sign out</a>
                        </div>
                    </div>
                )}


            </div>

        </div>

    );
}