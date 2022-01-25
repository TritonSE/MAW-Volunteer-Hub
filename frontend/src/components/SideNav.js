import React, { useState } from "react";
import "../styles/SideNav.css";

/**
 * @param {Array} tabs The array of tabs that you want to populate the side nav with.
 *                     Each element should be formated as such:
 *                     {
 *                      tab_name: {the name/title that will be displayed on the side-nav bar}
 *                      tab_content: {jsx component that will be rendered on the right-hand side of the screen}
 *                     }
 */
function SideNav({ tabs }) {
  // This helps determine which tab in the side nav bar should be highlighted.
  const [selected, setSelected] = useState(0);

  return (
    <div className="side_nav_layout">
      <div className="side_nav_buttons">
        {tabs.map((tab, tab_id) => (
          <button
            className={selected === tab_id ? "side_nav_selected" : "side_nav_links"}
            key={tab.tab_name}
            type="button"
            onClick={() => setSelected(tab_id)}
          >
            {tab.tab_name}
          </button>
        ))}
      </div>
      <div className="side_nav_display">
        {tabs.map((tab, ind) => (
          <div key={tab.tab_name} className={selected === ind ? "" : "hidden"}>
            {tab.tab_content}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SideNav;
