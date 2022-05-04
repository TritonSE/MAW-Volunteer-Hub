import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import ScrollContainer from "react-indiana-drag-scroll";
import { Link, useNavigate } from "react-router-dom";
import UserList from "./UserList";
import UserCardList from "./UserCardList";
import AssignBtn from "./AssignBtn";
import { SITE_PAGES } from "../constants/links";
import { api_user_all, api_user_verify } from "../api";
import { api_update_roles } from "../auth";

import "../styles/UserManage.css";

Modal.setAppElement(document.getElementById("root"));

function VerifyButtonCell({
  isVerified: initialVerified,
  name: userName,
  row: { index },
  column: { id },
  updateMyData,
  handleConfirmationModal,
  roles,
  user_id,
}) {
  const [isVerifiedState, setIsVerifiedState] = useState(initialVerified);
  const [rolesModalOpen, setRolesModalOpen] = useState(false);

  const [selectedRoles, setSelectedRoles] = useState(roles);

  const nonAdminRoles = [
    "Wish Granter",
    "Volunteer",
    "Mentor",
    "Airport Greeter",
    "Office",
    "Special Events",
    "Translator",
    "Speaker's Bureau",
    "Las Estrellas",
  ];

  const adminRoles = ["Primary Admin", "Secondary Admin"];

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

  function addRoles(e) {
    e.preventDefault();
    console.log(selectedRoles);
    api_update_roles(user_id, selectedRoles);
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
    <div>
      <ScrollContainer className="assign_btn_container" vertical={false}>
        {roles.length === 0 ? (
          <div>
            <AssignBtn
              label="Assign Role"
              key={Math.random()}
              onClick={() => setRolesModalOpen(true)}
            />
          </div>
        ) : (
          <div>
            {roles.map((label) => (
              <AssignBtn
                label={label}
                key={Math.random()}
                onClick={() => handleRoleBtnClick(label)}
              />
            ))}
          </div>
        )}
      </ScrollContainer>
      {/* Taken from Profile Page DUPLICATE FROM ProfileRoles.js */}
      <Modal
        className="add_roles_modal"
        overlayClassName="add_roles_modal_overlay"
        isOpen={rolesModalOpen}
        onRequestClose={() => setRolesModalOpen(false)}
        contentLabel="Add Roles Modal"
      >
        <button
          className="close_button"
          aria-label="close_button"
          type="button"
          onClick={() => setRolesModalOpen(false)}
        />
        <form className="add_roles_form" onSubmit={(e) => addRoles(e)}>
          <h2>Assign Role</h2>
          {nonAdminRoles.map((role) => (
            <div className="role_choice" key={Math.random()}>
              <input
                type="checkbox"
                checked={selectedRoles.includes(role)}
                onChange={() => setSelectedRoles([...selectedRoles, role])}
              />
              <label htmlFor="role_label">{role}</label>
            </div>
          ))}
          <p className="admin_roles_separator">Admin</p>
          {adminRoles.map((role) => (
            <div className="role_choice" key={Math.random()}>
              <input
                type="checkbox"
                checked={selectedRoles.includes(role)}
                onChange={() => setSelectedRoles([...selectedRoles, role])}
              />
              <label htmlFor="role_label">{role}</label>
            </div>
          ))}
          <button className="modal-button button-primary" type="submit">
            Assign
          </button>
        </form>
      </Modal>
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
    Header: "",
    accessor: "verified",
    Cell: (props) => (
      <VerifyButtonCell
        {...props}
        isVerified={props.value}
        name={props.row.original.name}
        roles={props.row.original.roles}
        user_id={props.row.original._id}
      />
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
  useEffect(() => {
    async function handleAPI() {
      const res = await api_user_all();
      if (res && !res.error) {
        setUserData(res.users);
        setHasFetched(true);
      }
    }
    handleAPI();
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
      <Modal
        isOpen={modalState.isOpen}
        contentLabel="Account Access"
        className="access_notification"
        overlayClassName="access_notification_overlay"
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
