import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { FixedSizeList as List } from "react-window";
import RoleSelect from "./RoleSelect";
import { api_user_all } from "../api";
import ROLES from "../constants/roles";
import "../styles/AddEventModal.css";
import "../styles/ViewEventModal.css";
import "../styles/AssignModal.css";

export default function AssignModal({ name, isOpen, setOpen, volunteers, setVolunteers }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [roles, setRoles] = useState(ROLES.map((role) => ({ ...role, value: role.name })));

  function filter_users(e, arr) {
    setFilteredUsers(
      users.filter(
        (user) =>
          user.name &&
          (user.name.toLowerCase().includes(e?.target?.value ?? search) ||
            user.email.toLowerCase().includes(e?.target?.value ?? search)) &&
          (roles.length === ROLES.length ||
            (arr ?? roles).some((role) => user.roles.includes(role.name)))
      )
    );
  }

  useEffect(async () => {
    const res = await api_user_all();
    if (res?.users) {
      setUsers(res.users);
      setFilteredUsers(res.users);
    }

    function resize() {
      setWindowHeight(window.innerHeight);
    }

    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(filter_users, [roles]);

  const UserEntry = React.memo(({ index, style }) => {
    const user = filteredUsers[index];
    const att = volunteers[user._id];
    const state = !att ? 0 : 1 + att.was_assigned;

    return (
      <div className={`user_row ${index % 2 === 0 ? "alt" : ""}`} style={style}>
        <div className="column wide">{user.name}</div>
        <div className="column fill roles">
          {user.roles.map((role) => {
            const obj = ROLES.find((tmp) => tmp.name === role);

            return (
              <div
                className="role_pill"
                style={{
                  border: `1px solid ${obj.color}`,
                }}
                key={role}
              >
                {role}
              </div>
            );
          })}
        </div>
        <div className="column">
          <button
            type="button"
            className={`user_assign state_${state}`}
            onClick={() => {
              const cpy = structuredClone(volunteers);
              if (state === 0) {
                cpy[user._id] = {
                  volunteer: user,
                  was_assigned: true,
                  guests: [],
                  response: "",
                };
              } else if (state === 2) {
                delete cpy[user._id];
              }
              setVolunteers(cpy);
            }}
          >
            {["Assign", "Going", "Assigned"][state]}
          </button>
        </div>
      </div>
    );
  });

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setOpen(false)}
      className="view_modal evt_modal assign_modal"
      overlayClassName="evt_modal_overlay highest"
    >
      <div className="evt_modal_header">
        <h1>Assign Volunteers to {name.trim() === "" ? "Event" : `"${name}"`}</h1>
        <button type="button" onClick={() => setOpen(false)}>
          <img alt="Close modal" src="/img/wishgranting_modal_close.svg" />
        </button>
      </div>
      <div className="search_form">
        <input
          type="text"
          placeholder="Search for a volunteer..."
          className="searchbar"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            filter_users(e);
          }}
        />
        <button type="button" className="search_button">
          <img src="/img/searchbar.svg" alt="Search" />
        </button>
        <RoleSelect value={roles} setValue={setRoles} hasError={false} variant={1} />
      </div>
      <div className="header">
        <div className="column wide">Name</div>
        <div className="column fill">Role</div>
        <div className="column">Assign</div>
      </div>
      <div className="content">
        <List
          height={3 * (windowHeight / 8)}
          itemCount={filteredUsers.length}
          itemSize={56}
          width={600}
        >
          {UserEntry}
        </List>
      </div>
      <br />
      <div className="evt_modal_footer">
        <button type="button" onClick={() => setOpen(false)}>
          Save
        </button>
      </div>
      <br />
    </Modal>
  );
}
