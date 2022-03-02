import React, { useState, useEffect } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import UserList from "./UserList";
import UserCardList from "./UserCardList";
import AssignBtn from "./AssignBtn";
import { api_get_users } from "../auth";

async function getUsers() {
  try {
    const res = await api_get_users();
    console.log(res);
  } catch {
    console.log("Couldn't access users");
  }
}

// NOTE: This is just a temporary implementation for the MVP
async function getUserData() {
  const backendUsers = await getUsers();
  console.log(backendUsers);

  const adminNames = ["Carly", "Gibson", "Freddie", "Bob"];
  const volunteerNames = [
    "Bob",
    "Rob",
    "Freddie",
    "Rib",
    "Pete",
    "Alice",
    "Carlos",
    "David",
    "Erin",
    "Frank",
    "Hank",
    "Grace",
  ];
  const users = [];

  adminNames.map((name, ind) =>
    users.push({
      Name: "Admin " + (ind + 1) + " (" + name + ")",
      Roles: [
        <ButtonContainer
          btnLabels={["Allow Access"]}
          userName={"Admin " + (ind + 1) + " (" + name + ")"}
        />,
      ],
      Admin: true,
      Completed: ind,
      Start: "May 2017",
    })
  );

  volunteerNames.map((name, ind) =>
    users.push({
      Name: "Volunteer " + (ind + 1) + " (" + name + ")",
      Roles: [
        <ButtonContainer
          btnLabels={["Allow Access"]}
          userName={"Volunteer " + (ind + 1) + " (" + name + ")"}
        />,
      ],
      Admin: false,
      Completed: ind,
      Start: "May 2017",
    })
  );
  return users;
}

// const userData = getUserData();

const headers = [
  {
    Header: "Name",
    accessor: "Name",
    Cell: (e) => (
      <a className="user_link" href="/">
        {e.value}
      </a>
    ),
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
  // {
  //   Header: "",
  //   accessor: "empty1",
  // },
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

function ButtonContainer({ btnLabels, userName }) {
  const [labels, setLabels] = useState(btnLabels);

  function handleRoleBtnClick() {
    if (labels.length === 1 && labels[0] === "Allow Access") {
      setLabels(["Assign Role"]);
    }
  }

  return (
    <ScrollContainer className="assign_btn_container" vertical={false}>
      {labels.map((label) => (
        <AssignBtn label={label} key={userName} onClick={handleRoleBtnClick()} />
      ))}
    </ScrollContainer>
  );
}

export default function UserManage() {
  const [userData, setUserData] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Updates the windowWidth variable if the window is resized
  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(async () => {
    const data = await getUserData();
    setUserData(data);
  }, []);
  if (!userData) {
    return <div>Data could not be fetched!!!</div>;
  }
  return (
    <div>
      {windowWidth > 650 ? (
        <UserList tableHeaders={headers} userData={userData} />
      ) : (
        <UserCardList userData={userData} />
      )}
    </div>
  );
}
