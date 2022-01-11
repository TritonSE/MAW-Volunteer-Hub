/**
    Super basic navbar without any styles
 */
import React from "react";
import { SITE_PAGES } from "../constants/links";
import { useLocation } from "react-router-dom";
import "../styles/NavBar.css";

const PAGES = {
    "Wish Granting": SITE_PAGES.WISH_GRANTING,
    "Manage": SITE_PAGES.MANAGE,    
};

export default function NavBar() {

    const location = useLocation().pathname;


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
                <button className="button" onClick={() => window.location.reload()}>
                    <img src="/img/searchbar.svg" alt="Search Bar" className="searchbar"/>
                </button>
            </div>

            <div className="profile-container">
                <button className="button" onClick={() => window.location.reload()}>
                    <img src="/img/profile_icon.svg" alt="Profile Icon" className="profile-icon"/>
                    <img src="/img/dropdown_icon.svg" alt="Arrow Dropdown" className="arrow-dropdown"/>
                </button>
            </div>

        </div>

    );
}