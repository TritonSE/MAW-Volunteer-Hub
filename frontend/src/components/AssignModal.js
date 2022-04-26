import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { FixedSizeList as List } from "react-window";
import { api_user_all } from "../api";
import { API_ENDPOINTS } from "../constants/links";
import "../styles/AddEventModal.css";
import "../styles/ViewEventModal.css";

export default function AssignModal({ isOpen, setOpen, volunteers, setVolunteers }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

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

  const UserEntry = React.memo(({ index, style }) => {
    const user = filteredUsers[index];
    return (
      <label key={user._id} htmlFor={user.name} style={style}>
        <input
          type="checkbox"
          id={user.name}
          checked={volunteers.some((vol) => vol._id === user._id)}
          onChange={(e) => {
            if (e.target.checked) {
              setVolunteers([...volunteers, user]);
            } else {
              const cpy = volunteers.slice();
              cpy.splice(
                cpy.findIndex((vol) => vol._id === user._id),
                1
              );
              setVolunteers(cpy);
            }
          }}
        />
        <img
          className="assign_pfp"
          src={`${API_ENDPOINTS.PFP_GET}/${user._id}/${new Date(
            user.profilePictureModified
          ).getTime()}`}
          alt={user.name}
        />
        <div className="calendar_checkbox" />
        <span>{user.name}</span>
      </label>
    );
  });

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setOpen(false)}
      className="view_modal evt_modal nonadmin"
      overlayClassName="evt_modal_overlay highest"
    >
      <div className="evt_modal_header">
        <h1>Assign Volunteers</h1>
        <button type="button" onClick={() => setOpen(false)}>
          <img alt="Close modal" src="/img/wishgranting_modal_close.svg" />
        </button>
      </div>
      <input
        type="text"
        placeholder="Search for a volunteer..."
        className="searchbar"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setFilteredUsers(
            users.filter((user) => user.name && user.name.toLowerCase().includes(e.target.value))
          );
        }}
      />
      <div className="evt_modal_content nonflex scroll">
        <List height={windowHeight / 2} itemCount={filteredUsers.length} itemSize={40} width={240}>
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
