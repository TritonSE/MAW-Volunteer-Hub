import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import ScrollContainer from "react-indiana-drag-scroll";
import UserList from "./UserList";
import UserCardList from "./UserCardList";
import AssignBtn from "./AssignBtn";
import { api_get_users, api_verify_user } from "../auth";

import "../styles/UserManage.css";

Modal.setAppElement(document.getElementById("root"));

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
  name: userName,
  row: { index },
  column: { id },
  updateMyData,
  handleConfirmationModal,
}) {
  // const [isOpen, setIsOpen] = useState(false);
  const [isVerifiedState, setIsVerifiedState] = useState(initialVerified);

  useEffect(() => {
    setIsVerifiedState(initialVerified);
  }, [initialVerified]);

  function handleVerifyUser() {
    updateMyData(index, id, true);

    setIsVerifiedState(true);
  }
  function handleRoleBtnClick(label) {
    if (label === "Allow Access") {
      // setIsOpen(true);
      handleConfirmationModal({ name: userName, isOpen: true });
      setIsVerifiedState(true);
      handleVerifyUser();
      // setUserData(null);
      // updateLocal(id, userData, setUserData);
    }
  }
  if (!isVerifiedState) {
    return (
      <ScrollContainer className="assign_btn_container" vertical={false}>
        <AssignBtn
          label="Allow Access"
          key={Math.random()}
          onClick={() => handleRoleBtnClick("Allow Access")}
        />
      </ScrollContainer>
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
    Cell: ({ row, value }) => (
      <a
        className="user_link"
        target="_blank"
        href={`/profile/${row.original._id}`}
        rel="noreferrer"
      >
        {value}
      </a>
    ),
  },
  // Replace the following three rows with the commented out rows for the full table
  {
    Header: "",
    accessor: "verified",
    Cell: (props) => (
      <VerifyButtonCell {...props} isVerified={props.value} name={props.row.original.name} />
    ),
  },
  {
    Header: "",
    accessor: "empty",
  },
];

export default function UserManage() {
  const [userData, setUserData] = useState(null);
  const [modalState, setModalState] = useState({ name: "", isOpen: false });
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
          // verify user here, reload if fail
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

  const handleConfirmationModal = ({ name, isOpen }) => {
    setModalState({ name, isOpen });
  };
  if (!userData) {
    return <div>Data could not be fetched!!!</div>;
  }
  return (
    <div>
      {windowWidth > 650 ? (
        <UserList
          tableHeaders={headers}
          userData={userData}
          updateMyData={updateMyData}
          handleConfirmationModal={handleConfirmationModal}
        />
      ) : (
        <UserCardList userData={userData} />
      )}
      <Modal
        isOpen={modalState.isOpen}
        contentLabel="Account Access"
        className="access_notification"
      >
        <div className="notification_contents">
          {modalState.name ?? "User"} has been given access.
          <button
            type="button"
            className="confirmation_btn"
            onClick={() => handleConfirmationModal({ name: "", isOpen: false })}
          >
            Okay
          </button>
        </div>
      </Modal>
    </div>
  );
}
