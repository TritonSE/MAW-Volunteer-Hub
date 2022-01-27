import React from "react";
import UserList from "../components/UserList";
import SideNav from "../components/SideNav";

function PeoplePage() {
  const tabs = [
    {
      tab_name: "People",
      tab_content: <UserList />,
    },
    {
      tab_name: "Places",
      tab_content: <UserList />,
    },
  ];
  return (
    <div>
      <div style={{ background: "#f7f7f7" }}>
        <SideNav tabs={tabs} />
      </div>
    </div>
  );
}

export default PeoplePage;
