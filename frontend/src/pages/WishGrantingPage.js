import React from "react";
import SideNav from "../components/SideNav";
import WishDiscovery from "../components/WishDiscovery";
import WishPlanning from "../components/WishPlanning";
import WishEnhancements from "../components/WishEnhancements";
import WishReveal from "../components/WishReveal";
import WishCloseout from "../components/WishCloseout";

function WishGrantingPage() {
  const tabs = [
    {
      tab_name: "Wish Discovery",
      tab_content: <WishDiscovery />,
    },
    {
      tab_name: "Wish Planning",
      tab_content: <WishPlanning />,
    },
    {
      tab_name: "Wish Journey Enhancements",
      tab_content: <WishEnhancements />,
    },
    {
      tab_name: "Wish Reveal & Celebration",
      tab_content: <WishReveal />,
    },
    {
      tab_name: "Wish Closeout",
      tab_content: <WishCloseout />,
    },
  ];

  /*
   * Note: Manual style on background is just for
   *   demo purposes (otherwise every other file
   *   entry would blend into the white background)
   */
  return (
    <div style={{ background: "#f7f7f7" }}>
      <SideNav tabs={tabs} />
    </div>
  );
}

export default WishGrantingPage;
