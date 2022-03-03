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
  return backendUsers;
}

// const userData = getUserData();

function VerifyButtonCell({
  isVerified: initialVerified,
  row: { index },
  column: { id },
  updateMyData,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVerifiedState, setIsVerifiedState] = useState(initialVerified);

  useEffect(() => {
    setIsVerifiedState(initialVerified);
  }, [initialVerified]);

  function handleVerifyUser() {
    updateMyData(index, id, true);

    setIsVerifiedState(true);
  }
  console.log(isVerifiedState);
  function handleRoleBtnClick(label) {
    if (label === "Allow Access") {
      setIsOpen(true);
      setIsVerifiedState(true);
      // setUserData(null);
      // updateLocal(id, userData, setUserData);
    }
  }
  if (!isVerifiedState) {
    return (
      <>
        <ScrollContainer className="assign_btn_container" vertical={false}>
          <AssignBtn label="Allow Access" key={Math.random()} onClick={() => handleVerifyUser()} />
        </ScrollContainer>
        <Modal isOpen={isOpen} contentLabel="Account Access" className="access_notification">
          <div className="notification_contents">
            User has been given access.
            <button type="button" className="confirmation_btn" onClick={() => setIsOpen(false)}>
              Okay
            </button>
          </div>
        </Modal>
      </>
    );
  }
  return (
    <ScrollContainer className="assign_btn_container" vertical={false}>
      {/* {buttonLabels.map((label) => (
          <AssignBtn label={label} key={Math.random()} onClick={() => handleRoleBtnClick(label)} />
        ))} */}
    </ScrollContainer>
  );
}

const headers = [
  {
    Header: "Name",
    accessor: "name",
    Cell: (e) => (
      <a className="user_link" href="/">
        {e.value}
      </a>
    ),
  },
  // Replace the following three rows with the commented out rows for the full table
  {
    Header: "",
    accessor: "verified",
    Cell: (props) => <VerifyButtonCell {...props} isVerified={props.value} />,
  },
  {
    Header: "",
    accessor: "empty",
  },
];

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

  // Get user data from backend
  useEffect(async () => {
    const data = await getUserData();
    setUserData(data.users);
  }, []);

  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setUserData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          // verify user here
          api_verify_user(row._id).catch((err) => {
            window.reload();
          });
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };

  if (!userData) {
    return <div>Data could not be fetched!!!</div>;
  }
  return (
    <div>
      {windowWidth > 650 ? (
        <UserList tableHeaders={headers} userData={userData} updateMyData={updateMyData} />
      ) : (
        <UserCardList userData={userData} />
      )}
    </div>
  );
}
