import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import ScrollContainer from "react-indiana-drag-scroll";
import UserList from "./UserList";
import UserCardList from "./UserCardList";
import AssignBtn from "./AssignBtn";
import { api_get_users, api_verify_user } from "../auth";

import "../styles/UserManage.css";

async function getUsers() {
  try {
    const res = await api_get_users();
    return res;
  } catch {
    console.log("Couldn't access users");
  }
  return "";
}

// NOTE: This is just a temporary implementation for the MVP
async function getUserData() {
  const backendUsers = await getUsers();

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
  return backendUsers;
}

// const userData = getUserData();

const headers = [
  {
    Header: "Name",
    accessor: "email",
    Cell: (e) => (
      <a className="user_link" href="/">
        {e.value}
      </a>
    ),
  },
  // Replace the following three rows with the commented out rows for the full table
  {
    Header: "",
    accessor: "roles",
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

function ButtonContainer({ btnLabels, id, userName }) {
  const [labels, setLabels] = useState(btnLabels);
  const [isOpen, setIsOpen] = useState(false);

  function handleRoleBtnClick() {
    if (labels.length === 1 && labels[0] === "Allow Access") {
      setLabels(["Assign Role"]);
      api_verify_user(id);
      setIsOpen(true);
    }
  }

  return (
    <div>
      <ScrollContainer className="assign_btn_container" vertical={false}>
        {labels.map((label) => (
          <AssignBtn label={label} key={Math.random()} onClick={() => handleRoleBtnClick()} />
        ))}
      </ScrollContainer>
      <Modal isOpen={isOpen} contentLabel="Account Access" className="access_notification">
        <div className="notification_contents">
          &quot;{userName}&quot; has been given access.
          <button type="button" className="confirmation_btn" onClick={() => setIsOpen(false)}>
            Okay
          </button>
        </div>
      </Modal>
    </div>
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

  // Change the plain text for roles into ButtonContainers
  function convertToAssignBtn(users) {
    for (let i = 0; i < users.length; i++) {
      if (users[i].roles.length === 0) {
        users[i].roles = [
          <ButtonContainer
            btnLabels={users[i].verified ? ["Assign Role"] : ["Allow Access"]}
            id={users[i]._id}
            userName={users[i].email}
          />,
        ];
      } else {
        users[i].roles = [
          <ButtonContainer btnLabel={users[i].roles} id={users[i]._id} userName={users[i].email} />,
        ];
      }
    }
    return users;
  }

  // Get user data from backend
  useEffect(async () => {
    const data = await getUserData();
    const convertedData = convertToAssignBtn(data.users);
    setUserData(convertedData);
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
