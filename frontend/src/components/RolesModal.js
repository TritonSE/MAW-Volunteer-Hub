import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { api_update_roles } from "../auth";

export default function RolesModal(open, setOpen, pRoles, Puser_id) {
  const [selectedRoles, setSelectedRoles] = useState(pRoles);

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
    console.log("ROLES MODAL: " + pRoles);
  }, [pRoles]);

  function addRoles() {
    api_update_roles(Puser_id, JSON.stringify(selectedRoles.slice(1)));
  }

  function changeSelectionStatus(role) {
    if (selectedRoles.indexOf(role) !== -1) {
      const tempRoles = selectedRoles.filter((aRole) => aRole !== role);
      setSelectedRoles(tempRoles);
    } else {
      const tempRoles = [...selectedRoles, role];
      setSelectedRoles(tempRoles);
    }
  }

  return (
    <Modal
      className="add_roles_modal"
      overlayClassName="add_roles_modal_overlay"
      isOpen={open}
      onRequestClose={() => setOpen(false)}
      contentLabel="Add Roles Modal"
    >
      <button
        className="close_button"
        aria-label="close_button"
        type="button"
        onClick={() => setOpen(false)}
      />
      <form className="add_roles_form" onSubmit={() => addRoles()}>
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
