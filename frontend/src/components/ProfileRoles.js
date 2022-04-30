import React, { useState } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import Modal from "react-modal";
import AssignBtn from "./AssignBtn";

import "../styles/ProfileRoles.css";

export default function ProfileRoles(props) {
  const [rolesModalOpen, setRolesModalOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState(props.roles);

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

  // Dummy method that collects new roles.
  const addRoles = (e) => {
    e.preventDefault();
    console.log(selectedRoles);
  };

  return (
    <div className="roles_container">
      <div className="roles_header">
        <h2>Roles</h2>
        {/* Taken from ProfilePage.js and ProfilePage.css */}
        {props.admin ? (
          <button type="button" className="add_roles" onClick={() => setRolesModalOpen(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
            </svg>
          </button>
        ) : (
          <div />
        )}
      </div>

      <ScrollContainer className="roles_scroller" vertical={false}>
        {props.roles.length > 0
          ? props.roles.map((role) => (
              <AssignBtn
                label={role}
                key={Math.random()}
                onClick={() => alert(role + " clicked")}
                onDelete={() => alert(role + " deleted")}
                admin={props.admin}
              />
            ))
          : ["No Roles"]}
      </ScrollContainer>

      {/* Taken from Profile Page */}
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
