import React from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import UserList from "../components/UserList";
import SideNav from "../components/SideNav";
import AssignBtn from "../components/AssignBtn";

function ButtonContainer({ btnLabels }) {
  return (
    <ScrollContainer className="assign_btn_container">
      {btnLabels.map((label) => (
        <AssignBtn label={label} key={Math.random()} />
      ))}
    </ScrollContainer>
  );
}

function ManagePage() {
  const userData = [
    {
      Name: "Gibby Gibson",
      Roles: [<ButtonContainer btnLabels={["Allow Access"]} />],
      // Completed: 3,
      // Start: "May 2017",
    },
    {
      Name: "Carly Shay",
      Roles: [<ButtonContainer btnLabels={["Allow Access"]} />],
      // Roles: [<ButtonContainer btnLabels={["Airport Greeter", "Wish Granter"]} />],
      // Completed: 1,
      // Start: "Feb 2019",
    },
    {
      Name: "Freddie Benson",
      Roles: [<ButtonContainer btnLabels={["Allow Access"]} />],
      // Roles: [<ButtonContainer btnLabels={["Wish Granter", "Meeter"]} />],
      // Completed: 2,
      // Start: "June 2016",
    },
    {
      Name: "Bob Bob",
      Roles: [<ButtonContainer btnLabels={["Allow Access"]} />],
      // Roles: [<ButtonContainer btnLabels={["Wish Granter"]} />],
      // Completed: 2,
      // Start: "May 2020",
    },
    {
      Name: "Bob Rob",
      Roles: [<ButtonContainer btnLabels={["Allow Access"]} />],
      // Roles: [<ButtonContainer btnLabels={["Wish Granter", "Airport Greeter"]} />],
      // Completed: 2,
      // Start: "June 2020",
    },
  ];

  const headers = [
    {
      Header: "Name",
      accessor: "Name",
    },
    // Replace the following three rows with the commented out rows for the full table
    {
      Header: "",
      accessor: "Roles",
    },
    {
      Header: "",
      accessor: "empty",
    },
    {
      Header: "",
      accessor: "empty1",
    },
    // {
    //   Header: "Roles",
    //   accessor: "Roles",
    // },
    // {
    //   Header: "Assignments Completed",
    //   accessor: "Completed",
    // },
    // {
    //   Header: "Volunteer Since",
    //   accessor: "Start",
    // },
  ];

  // const tabs = [
  //   {
  //     tab_name: "People",
  //     tab_content: <UserList tableHeaders={headers} userData={userData} />,
  //   },
  //   {
  //     tab_name: "Places",
  //     tab_content: <UserList />,
  //   },
  // ];
  return (
    <div>
      <div style={{ background: "#f7f7f7" }}>
        {/* <SideNav tabs={tabs} /> */}
        <UserList tableHeaders={headers} userData={userData} />
      </div>
    </div>
  );
}

export default ManagePage;
