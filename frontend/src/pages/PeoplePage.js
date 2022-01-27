import React from "react";
import UserList from "../components/UserList";
import SideNav from "../components/SideNav";

function PeoplePage() {
  const userData = [
    {
      Name: "Gibby Gibson",
      Roles: [],
      Completed: 3,
      Start: "May 2017",
    },
    {
      Name: "Carly Shay",
      Roles: ["Airport Greeter"],
      Completed: 1,
      Start: "Feb 2019",
    },
    {
      Name: "Freddie Benson",
      Roles: ["Wish Granter", "Meeter"],
      Completed: 2,
      Start: "June 2016",
    },
  ];

  const headers = [
    {
      Header: "Name",
      accessor: "Name",
    },
    {
      Header: "Roles",
      accessor: "Roles",
    },
    {
      Header: "Assignments Completed",
      accessor: "Completed",
    },
    {
      Header: "Volunteer Since",
      accessor: "Start",
    },
  ];

  const tabs = [
    {
      tab_name: "People",
      tab_content: <UserList tableHeaders={headers} userData={userData} />,
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
