import React from "react";
import "../styles/NavMenuDropdown.css";

function NavMenuDropdown() {
  return (
    <div className="nav-menu">
      <button type="button" className="dropdown-button">
        <img src="/img/hamburger.svg" alt="Hamburger menu dropdown" className="hamburger" />
      </button>
    </div>
  );
}

export default NavMenuDropdown;
