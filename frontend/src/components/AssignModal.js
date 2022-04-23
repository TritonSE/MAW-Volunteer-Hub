import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { api_user_all } from "../api";
import { API_ENDPOINTS } from "../constants/links";
import "../styles/AddEventModal.css";
import "../styles/ViewEventModal.css";

export default function AssignModal({ isOpen, setOpen, volunteers, setVolunteers }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(async () => {
    const res = await api_user_all();
    if (res?.users) setUsers(res.users);
  }, []);

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
      <div className="evt_modal_content nonflex scroll">
        <input
          type="text"
          placeholder="Search for a volunteer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="spacer" />
        {users
          .filter((user) => user.name && user.name.toLowerCase().includes(search))
          .map((user) => (
            <label key={user._id} htmlFor={user.name}>
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
          ))}
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
