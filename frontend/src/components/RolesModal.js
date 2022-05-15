import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { api_update_roles } from "../auth";
import "../styles/RolesModal.css";

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

export default function RolesModal(props) {
  const [selectedRoles, setSelectedRoles] = useState(props.roles);

  function handleManagePageUpdate() {
    props.setRoles(selectedRoles);
    props.updateMyRoles(selectedRoles);
  }

  function addRoles(e) {
    e.preventDefault();
    // Update manage page with local data.
    api_update_roles(props.id, JSON.stringify(selectedRoles)).then(
      props.manage ? handleManagePageUpdate() : props.rolesChanged(true)
    );
    props.setOpen(false);
  }

  // Modifies selectedRoles
  function changeSelectionStatus(role) {
    // Removes previously selected roles from selectedRoles
    if (selectedRoles.indexOf(role) !== -1) {
      const tempRoles = selectedRoles.filter((aRole) => aRole !== role);
      setSelectedRoles(tempRoles);
      // Adds newly selected roles to selectedRoles
    } else {
      const tempRoles = [...selectedRoles, role];
      setSelectedRoles(tempRoles);
    }
  }

  useEffect(() => setSelectedRoles(props.roles), [props.roles]);

  return (
    <Modal
      className="add_roles_modal"
      overlayClassName="add_roles_modal_overlay"
      isOpen={props.open}
      onRequestClose={() => props.setOpen(false)}
      contentLabel="Add Roles Modal"
    >
      <button
        className="roles_close_button"
        aria-label="roles_close_button"
        type="button"
        onClick={() => props.setOpen(false)}
      />
      <form className="add_roles_form" onSubmit={(e) => addRoles(e)}>
        <h2>Assign Role</h2>
        {nonAdminRoles.map((role) => (
          <div className="role_choice" key={Math.random()}>
            <input
              type="checkbox"
              checked={selectedRoles.includes(role)}
              onChange={() => changeSelectionStatus(role)}
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
              onChange={() => changeSelectionStatus(role)}
            />
            <label htmlFor="role_label">{role}</label>
          </div>
        ))}
        <button className="modal-button button-primary" type="submit">
          Assign
        </button>
      </form>
    </Modal>
  );
}
