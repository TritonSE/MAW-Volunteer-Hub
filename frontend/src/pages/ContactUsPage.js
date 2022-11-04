import React, { useEffect } from "react";
import SideNav from "../components/SideNav";
import { CONTACT_SIDENAV_STEPS, CONTACT_SIDENAV_ROUTES } from "../constants/links";

function ContactUsPage() {
  const tabs = CONTACT_SIDENAV_STEPS.map((name, ind) => ({
    tab_route: CONTACT_SIDENAV_ROUTES[ind],
    tab_name: name,
  }));

  useEffect(() => {
    document.title = "Contact Us - Make-a-Wish San Diego";
  }, []);

  return <SideNav tabs={tabs} isResources />;
}

export default ContactUsPage;
