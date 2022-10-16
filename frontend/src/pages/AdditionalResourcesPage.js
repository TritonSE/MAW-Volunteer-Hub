import React, { useEffect } from "react";
import SideNav from "../components/SideNav";
import { RESOURCES_SIDENAV_STEPS, RESOURCES_SIDENAV_ROUTES } from "../constants/links";

function AdditionalResourcesPage() {
  const tabs = RESOURCES_SIDENAV_STEPS.map((name, ind) => ({
    tab_route: RESOURCES_SIDENAV_ROUTES[ind],
    tab_name: name,
  }));

  useEffect(() => {
    document.title = "Additional Resources - Make-a-Wish San Diego";
  }, []);

  return <SideNav tabs={tabs} />;
}

export default AdditionalResourcesPage;
