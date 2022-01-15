import React from "react";
import "../styles/SideNav.css";

function SideNav({ tabs }) {
  return (
    <div>
      {tabs.map((tab) => (
        <div>{tab.tab_name}</div>
      ))}
    </div>
  );
}

export default SideNav;
