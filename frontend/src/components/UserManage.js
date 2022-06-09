import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import ScrollContainer from "react-indiana-drag-scroll";
import { Link, useNavigate } from "react-router-dom";
import UserList from "./UserList";
import UserCardList from "./UserCardList";
import AssignBtn from "./AssignBtn";
import RolesModal from "./RolesModal";
import { SITE_PAGES } from "../constants/links";
import { api_user_all, api_user_verify } from "../api";

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
  admin,
}) {
  const [isVerifiedState, setIsVerifiedState] = useState(initialVerified);
  const [rolesModalOpen, setRolesModalOpen] = useState(false);
  const [modifiedRoles, setModifiedRoles] = useState(roles);

  useEffect(() => {
    setIsVerifiedState(initialVerified);
  }, [initialVerified]);

  function handleVerifyUser() {
    updateMyData(index, id, true, user_id);
    setIsVerifiedState(true);
  }

  const handleRolesUpdate = (selectedRoles) => {
    updateMyData(index, "roles", selectedRoles, user_id);
  };

  function getModifiedRoles() {
    if (admin === 1 && roles[1] !== "Secondary Admin") {
      setModifiedRoles(["Secondary Admin", ...roles]);
    } else if (admin === 2 && roles[0] !== "Primary Admin") {
      setModifiedRoles(["Primary Admin", "Secondary Admin", ...roles]);
    }
  }

  useEffect(() => {
    getModifiedRoles();
  }, []);

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

  // if (!isVerifiedState) {
  //   return (
  //     <ScrollContainer className="assign_btn_container" vertical={false}>
  //       <AssignBtn
  //         label="Allow Access"
  //         key={Math.random()}
  //         admin
  //         onClick={() => handleRoleBtnClick("Allow Access")}
  //       />
  //     </ScrollContainer>
  //   );
  // }
  return (
    <div>
      <ScrollContainer className="assign_btn_container" vertical={false}>
        {modifiedRoles.length === 0 ? (
          <AssignBtn
            label="Assign Role"
            key={Math.random()}
            onClick={() => setRolesModalOpen(true)}
            admin
            profilePage={false}
          />
        ) : (
          modifiedRoles.map((label) => (
            <AssignBtn
              label={label}
              key={Math.random()}
              onClick={() => setRolesModalOpen(true)}
              admin
              profilePage={false}
            />
          ))
        )}
      </ScrollContainer>
      <RolesModal
        open={rolesModalOpen}
        setOpen={setRolesModalOpen}
        roles={modifiedRoles}
        id={user_id}
        manage
        setRoles={setModifiedRoles}
        updateMyRoles={handleRolesUpdate}
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
    Cell: (props) => (
      <VerifyButtonCell
        {...props}
        isVerified={props.value}
        name={props.row.original.name}
        roles={props.row.original.roles}
        user_id={props.row.original._id}
        admin={props.row.original.admin}
      />
    ),
  },
  {
    Header: "Assignments Completed",
    accessor: "",
    Cell: ({ row }) => {
      const u = row.original;
      let sum = u.manualEvents.length;
      const today = new Date();
      u.events.forEach((event) => {
        if (new Date(event.to) < today) {
          // only events if they have passed
          sum++;
        }
      });
      return sum;
    },
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
    // We also turn on the flag to not reset the page
    // we don't use rowIndex because we filter before displaying, so the userData
    // includes users from both the admin and user lists
    api_user_verify(userId).then((res) => {
      if (!res || res.error) navigate(window.location);

      const old = [...userData] ?? [];
      const i = old.findIndex((row) => row._id === userId);

      old.splice(i, 1, {
        ...old[i],
        [columnId]: value,
      });

      setUserData(old);
    });
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
