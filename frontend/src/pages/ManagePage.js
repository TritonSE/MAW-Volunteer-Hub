import React, { useEffect } from "react";
import SideNav from "../components/SideNav";
import { MANAGE_STEPS, MANAGE_ROUTES } from "../constants/links";

function ManagePage() {
  const tabs = MANAGE_STEPS.map((name, ind) => ({
    tab_route: MANAGE_ROUTES[ind],
    tab_name: name,
  }));

  useEffect(() => {
    document.title = "Manage - Make-a-Wish San Diego";
  }, []);

  return (
    <div>
      <div style={{ background: "#f7f7f7" }}>
        <SideNav tabs={tabs} manage />
      </div>
    </div>
  );
}

export default ManagePage;
