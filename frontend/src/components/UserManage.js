import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import ScrollContainer from "react-indiana-drag-scroll";
import { Link, useNavigate } from "react-router-dom";
import UserList from "./UserList";
import UserCardList from "./UserCardList";
import AssignBtn from "./AssignBtn";
import { SITE_PAGES } from "../constants/links";
import { api_user_all, api_user_verify } from "../auth";

import "../styles/UserManage.css";

Modal.setAppElement(document.getElementById("root"));

// Get user data from backend
async function getUsers() {
  try {
    const res = await api_user_all();
    return res;
  } catch {
    console.error("Couldn't access users");
  }
  return "";
}

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

  function handleRoleBtnClick(label) {
    if (label === "Allow Access") {
      // setIsOpen(true);
      handleConfirmationModal({ name: userName, isOpen: true });
      handleVerifyUser();
      // setIsVerifiedState(true);
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
    const data = await getUsers();
    setUserData(data.users);
    setHasFetched(true);
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
        />
      ) : (
        <UserCardList
          userData={userData}
          VerifyButtonCell={VerifyButtonCell}
          updateMyData={updateMyData}
          handleConfirmationModal={handleConfirmationModal}
        />
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
