import React, { useState, useEffect } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import { Link, useNavigate } from "react-router-dom";

import Button from "./base/Button";
import Modal from "./base/Modal";

import UserList from "./UserList";
import UserCardList from "./UserCardList";

import { SITE_PAGES } from "../constants/links";
/* import ROLES from "../constants/roles"; */

import { api_user_all, api_user_verify } from "../api";

import "../styles/UserManage.css";

function VerifyButtonCell({
  isVerified: initialVerified,
  name: userName,
  row: { index },
  column: { id },
  updateMyData,
  handleConfirmationModal,
}) {
  const [isVerifiedState, setIsVerifiedState] = useState(initialVerified);

  useEffect(() => {
    setIsVerifiedState(initialVerified);
  }, [initialVerified]);

  function handleVerifyUser() {
    // console.log({ index, id });
    updateMyData(index, id, true);
    setIsVerifiedState(true);
  }

  /*
  function handleRoleBtnClick(label) {
    // TODO
  }
  */

  if (!isVerifiedState) {
    return (
      <ScrollContainer className="assign_btn_container" vertical={false}>
        <button
          type="button"
          className="role_btn access"
          onClick={() => {
            handleConfirmationModal({ name: userName, isOpen: true });
            handleVerifyUser();
          }}
        >
          Allow Access
        </button>
      </ScrollContainer>
    );
  }
  return (
    <ScrollContainer className="assign_btn_container" vertical={false}>
      {/*
      {
        buttonLabels.map((label) => (
          <button
            key={label}
            className="role_btn"
            style={{
              border: `1px solid ${ROLES.find((role) => (role.name === label)).color}`,
            }}
            onClick={() => handleRoleBtnClick(label)}
          >
            {label}
          </button>
        ))
      }
      */}
    </ScrollContainer>
  );
}

const headers = [
  {
    Header: "Name",
    accessor: "name",
    Cell: ({ row, value }) => (
      <Link className="user_link" to={`${SITE_PAGES.PROFILE}/${row.original._id}`}>
        {value}
      </Link>
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
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [hasFetched, setHasFetched] = useState(false);
  const [filter, setFilter] = useState("");

  const navigate = useNavigate();

  // Updates the windowSize variable if the window is resized
  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Get user data from backend
  useEffect(async () => {
    const res = await api_user_all();
    if (res && !res.error) {
      setUserData(res.users);
      setHasFetched(true);
    }
  }, []);

  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setUserData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          // verify user here, reload if fail
          api_user_verify(row._id).then((res) => {
            if (!res || res.error) navigate(window.location);
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
  if (!hasFetched) {
    return <div />;
  }
  if (hasFetched && !userData) {
    return (
      <div>
        <p>Data could not be fetched, please reload</p>
      </div>
    );
  }
  return (
    <div>
      {windowSize.width > 650 && windowSize.height > 450 ? (
        <UserList
          tableHeaders={headers}
          userData={userData}
          updateMyData={updateMyData}
          handleConfirmationModal={handleConfirmationModal}
          filter={filter}
          setFilter={setFilter}
        />
      ) : (
        <UserCardList
          userData={userData}
          VerifyButtonCell={VerifyButtonCell}
          updateMyData={updateMyData}
          handleConfirmationModal={handleConfirmationModal}
          filter={filter}
          setFilter={setFilter}
        />
      )}
      <Modal isOpen={modalState.isOpen} contentLabel="Account Access" variant="thin center">
        <div className="notification_contents">
          {modalState.name ?? "User"} has been given access.
          <br />
          <br />
          <Button
            variant="primary"
            onClick={() => handleConfirmationModal({ name: "", isOpen: false })}
          >
            Okay
          </Button>
        </div>
      </Modal>
    </div>
  );
}
