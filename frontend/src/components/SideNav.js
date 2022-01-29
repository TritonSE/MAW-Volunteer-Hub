/* eslint no-restricted-globals: "off" */
import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import history from "../history";
import "../styles/SideNav.css";

/**
 * @param {Array} tabs The array of tabs that you want to populate the side nav with.
 *                     Each element should be formated as such:
 *                     {
 *                      tab_name: {the name/title that will be displayed on the side-nav bar}
 *                      tab_content: {jsx component that will be rendered on the right-hand side of the screen}
 *                     }
 */
function SideNav({ tabs, getContext }) {
  function compute_route_tab() {
    let out = 0;
    // tabs.findIndex() causes React to throw an error
    tabs.forEach((tab, ind) => {
      if (location.pathname.indexOf(tab.tab_route) > -1) {
        out = ind;
      }
    });
    return out;
  }

  // This helps determine which tab in the side nav bar should be highlighted.
  const [selected, setSelected] = useState(compute_route_tab());

  useEffect(
    () =>
      history.listen(() => {
        setSelected(compute_route_tab());
      }),
    []
  );

  return (
    <div className="side_nav_layout">
      <div className="side_nav_buttons">
        {tabs.map((tab, tab_id) => (
          <Link
            to={tab.tab_route}
            key={tab.tab_name}
            className={`side_nav_links${
              tab_id === compute_route_tab() ? " side_nav_selected" : ""
            }`}
            onClick={() => setSelected(tab_id)}
          >
            {tab.tab_name}
          </Link>
        ))}
      </div>
      <div className="side_nav_display">
        <Outlet context={getContext(tabs[selected], selected)} />
      </div>
    </div>
  );
}

export default SideNav;
