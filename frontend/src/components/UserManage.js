import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import ScrollContainer from "react-indiana-drag-scroll";
import { Link } from "react-router-dom";
import UserList from "./UserList";
import UserCardList from "./UserCardList";
import AssignBtn from "./AssignBtn";
import RolesModal from "./RolesModal";
import { SITE_PAGES } from "../constants/links";
import { api_user_all } from "../api";

import "../styles/UserManage.css";

Modal.setAppElement(document.getElementById("root"));

function VerifyButtonCell({ row: { index }, updateMyData, user }) {
  const [rolesModalOpen, setRolesModalOpen] = useState(false);

  const modifiedRoles = user.roles.slice();
  if (user.admin === 2) modifiedRoles.push("Primary Admin");
  if (user.admin >= 1) modifiedRoles.push("Secondary Admin");

  return (
    <div>
      <ScrollContainer className="assign_btn_container" vertical={false}>
        {modifiedRoles.length === 0 ? (
          <AssignBtn
            label="Assign Role"
            onClick={() => setRolesModalOpen(true)}
            profilePage={false}
          />
        ) : (
          modifiedRoles.map((label) => (
            <AssignBtn
              key={label}
              label={label}
              onClick={() => setRolesModalOpen(true)}
              profilePage={false}
            />
          ))
        )}
      </ScrollContainer>
      <RolesModal
        open={rolesModalOpen}
        setOpen={setRolesModalOpen}
        user={user}
        onRolesChange={(selectedRoles, selectedAdmin) => {
          updateMyData(index, ["roles", "admin"], [selectedRoles, selectedAdmin], user._id);
        }}
      />
    </div>
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
    Header: "Role",
    accessor: "verified",
    Cell: (props) => <VerifyButtonCell {...props} isVerified={props.value} user={props.original} />,
  },
  {
    Header: "Assignments Completed",
    accessor: "",
    Cell: ({ row }) =>
      row.original.events.reduce(
        (prev, next) =>
          prev +
          Object.entries(next.repetitions).reduce(
            (subprev, [date, subnext]) =>
              subprev +
              (new Date(date).setHours(
                new Date(next.to).getHours(),
                new Date(next.to).getMinutes()
              ) <= Date.now() &&
                Object.prototype.hasOwnProperty.call(subnext.attendees, row.original._id)),
            0
          ),
        0
      ) +
      row.original.manualEvents.filter((evt) => new Date(evt.date).getTime() <= Date.now()).length,
  },
  {
    Header: "Volunteer Since",
    accessor: "createdAt",
    Cell: ({ value }) => (
      <p>{new Date(value).toLocaleString("default", { month: "short", year: "numeric" })}</p>
    ),
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

  // Updates the windowSize variable if the window is resized
  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Get user data from backend
  useEffect(() => {
    async function fetchUsers() {
      const res = await api_user_all();
      if (res && !res.error) {
        setUserData(res.users);
        setHasFetched(true);
      }
    }
    fetchUsers();
  }, []);

  const updateMyData = (_rowIndex, columnId, value, userId) => {
    const old = [...userData] ?? [];
    const i = old.findIndex((row) => row._id === userId);

    if (i === -1) return;

    if (Array.isArray(columnId)) {
      columnId.forEach((col, ind) => {
        old[i][col] = value[ind];
      });
    } else {
      old[i][columnId] = value;
    }
    setUserData(old);
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
      <Modal
        isOpen={modalState.isOpen}
        contentLabel="Account Access"
        className="access_notification"
        overlayClassName="access_notification_overlay"
      >
        <div className="notification_contents">
          {modalState.name ?? "User"} has been given access and will be sent a notification via
          email.
          <button
            type="button"
            className="maw-ui_button primary"
            onClick={() => handleConfirmationModal({ name: "", isOpen: false })}
          >
            Okay
          </button>
        </div>
      </Modal>
    </div>
  );
}
