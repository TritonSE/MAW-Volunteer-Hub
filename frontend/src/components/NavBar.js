/**
    Super basic navbar without any styles
 */
import React from "react";
import { SITE_PAGES } from "../constants/links";

export default function NavBar() {
    return (
        <div>
            {/* Navigation Links */}
            <a href={SITE_PAGES.LOGIN}>
                Log In
            </a>
            <a href={SITE_PAGES.PEOPLE}>
                People
            </a>
            <a href={SITE_PAGES.WISH_GRANTING}>
                Wish Granting
            </a>
            <a href={SITE_PAGES.PROFILE}>
                Profile
            </a>
        </div>
    );
}