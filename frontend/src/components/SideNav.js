import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import ScrollContainer from "react-indiana-drag-scroll";
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
function SideNav({ tabs, manage, isResources = false }) {
  function compute_route_tab() {
    let out = 0;
    // tabs.findIndex() causes React to throw an error
    tabs.forEach((tab, ind) => {
      if (history.location.pathname.indexOf(tab.tab_route) > -1) {
        out = ind;
      }
    });
    return out;
  }

  // This helps determine which tab in the side nav bar should be highlighted.
  const [selected, setSelected] = useState(compute_route_tab());
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(
    () =>
      history.listen(() => {
        setSelected(compute_route_tab());
      }),
    []
  );

  // Updates the windowWidth variable if the window is resized
  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="side_nav_layout">
      <ScrollContainer className="side_nav_buttons" vertical={false}>
        {tabs.map((tab, tab_id) => (
          <Link
            to={tab.tab_route}
            key={tab.tab_name}
            className={`${isResources ? "side_nav_links_resources" : "side_nav_links"}${
              tab_id === compute_route_tab()
                ? ` ${isResources ? "side_nav_selected_resources" : "side_nav_selected"}`
                : ""
            }`}
            onClick={() => setSelected(tab_id)}
          >
            {tab.tab_name}
            {manage && tab_id === compute_route_tab() && windowWidth < 650 ? (
              <div className={`${isResources ? "arrow_resources" : "arrow"}`} />
            ) : null}
          </Link>
        ))}
      </ScrollContainer>
      <div className="side_nav_display">{manage ? <Outlet /> : <Outlet context={selected} />}</div>
    </div>
  );
}

export default SideNav;
