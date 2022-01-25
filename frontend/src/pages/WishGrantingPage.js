import React from "react";
import SideNav from "../components/SideNav";
import WishStep from "../components/WishStep";

function WishGrantingPage() {
  const tabs = [
    {
      tab_name: "Wish Discovery",
      tab_content: <WishStep stepName="Step 1: Wish Discovery" />,
    },
    {
      tab_name: "Wish Planning",
      tab_content: <WishStep stepName="Step 2: Wish Planning" />,
    },
    {
      tab_name: "Wish Journey Enhancements",
      tab_content: <WishStep stepName="Step 3: Wish Enhancements" />,
    },
    {
      tab_name: "Wish Reveal & Celebration",
      tab_content: <WishStep stepName="Step 4: Wish Reveal & Celebration" />,
    },
    {
      tab_name: "Wish Closeout",
      tab_content: <WishStep stepName="Step 5: Wish Closeout" />,
    },
  ];

  return <SideNav tabs={tabs} />;
}

export default WishGrantingPage;
