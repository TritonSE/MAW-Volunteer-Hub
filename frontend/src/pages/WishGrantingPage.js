import React from "react";
import SideNav from "../components/SideNav";

function WishGrantingPage() {
  const tabs = [
    {
      tab_id: 0,
      tab_name: "Wish Discovery",
      tab_content: "/WishDiscovery",
    },
    {
      tab_id: 1,
      tab_name: "Wish Planning",
      tab_content: "/WishPlanning",
    },
    {
      tab_id: 2,
      tab_name: "Wish Journey Enhancements",
      tab_content: "/WishEnhancements",
    },
    {
      tab_id: 3,
      tab_name: "Wish Reveal & Celebration",
      tab_content: "/WishReveal",
    },
    {
      tab_id: 4,
      tab_name: "Wish Closeout",
      tab_content: "/WishCloseout",
    },
  ];

  return (
    <div>
      <SideNav tabs={tabs} />
    </div>
  );
}

export default WishGrantingPage;
