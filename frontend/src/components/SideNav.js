import React from "react";
import "../styles/SideNav.css";

function SideNav({ tabs }) {
  return (
    <div className="side_nav_buttons">
      {tabs.map((tab) => (
        <a href={tab.tab_content}>
          <button className="side_nav_links" type="button">
            {tab.tab_name}
          </button>
        </a>
      ))}
    </div>
  );
}

export default SideNav;
