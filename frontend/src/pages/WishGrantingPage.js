import React from "react";
import SideNav from "../components/SideNav";
import { SIDENAV_STEPS, SIDENAV_ROUTES } from "../constants/links";

function WishGrantingPage() {
  const tabs = SIDENAV_STEPS.map((name, ind) => ({
    tab_route: SIDENAV_ROUTES[ind],
    tab_name: name,
  }));

  return <SideNav tabs={tabs} />;
}

export default WishGrantingPage;
