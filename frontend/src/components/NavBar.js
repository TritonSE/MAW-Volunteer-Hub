/**
    Super basic navbar without any styles
 */
import React from "react";
import { SITE_PAGES } from "../constants/links";
import { useLocation } from "react-router-dom";
import "../css/NavBar.css";

const PAGES = {
    "Wish Granting": SITE_PAGES.WISH_GRANTING,
    "Manage": SITE_PAGES.MANAGE,    
};

export default function NavBar() {

    const location = useLocation().pathname;


    return (
        <div>

            <div className="container">

                <img src="/img/maw_logo.svg" alt="Make-A-Wish logo" className="maw-logo"/>


                { Object.entries(PAGES).map( ([page, route]) => (

                    <div className="page-name">
                        <a className="page-links" href={route}>{page}</a>
                        <div className={location === route ? "underline-shown" : "underline-hidden"}/>
                    </div>

                ))}

            
            <div className="search">
                <button>
                    <img src="/img/searchbar.svg" alt="Search Bar" className="searchbar"/>
                </button>
            </div>

            <div className="profile-dropdown">
                <button>
                    <img src="/img/profile_icon.svg" alt="Search Bar" className="searchbar"/>
                    <img src="/img/dropdown_icon.svg" alt="Search Bar" className="searchbar"/>
                </button>
            </div>

            </div>

        </div>
    );
}