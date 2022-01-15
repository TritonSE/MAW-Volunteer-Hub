import React, { useState } from "react";
import "../styles/SideNav.css";

function SideNav({ tabs }) {
  const [displayed, setDisplayed] = useState(tabs[0].tab_content);

  const changeTab = (id) => {
    setDisplayed(tabs[id].tab_content);
  };

  return (
    <div className="side_nav_layout">
      <div className="side_nav_buttons">
        {tabs.map((tab) => (
          <button
            className="side_nav_links"
            type="button"
            onClick={() => {
              changeTab(tab.tab_id);
            }}
          >
            {tab.tab_name}
          </button>
        ))}
      </div>
      <div className="side_nav_display">{displayed}</div>
    </div>
  );
}

export default SideNav;
