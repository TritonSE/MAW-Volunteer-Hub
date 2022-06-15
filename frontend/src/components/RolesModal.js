import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useArrayState } from "@cubedoodl/react-simple-scheduler";
import { api_update_roles } from "../api";
import ROLES from "../constants/roles";
import "../styles/RolesModal.css";
import "../styles/ProfileRoles.css"; /* For error modal styles */

export default function RolesModal({ open, setOpen, user, onRolesChange }) {
  const [selectedRoles, setSelectedRoles, addRole, deleteRole] = useArrayState(user.roles);
  const [selectedAdmin, setSelectedAdmin] = useState(user.admin);
  const [errorOpen, setErrorOpen] = useState(false);

  async function addRoles(e) {
    e.preventDefault();
    const res = await api_update_roles(user._id, JSON.stringify(selectedRoles), selectedAdmin);
    if (res && !res.error) {
      onRolesChange(selectedRoles);
      setOpen(false);
    } else {
      setErrorOpen(res?.error ?? "Unable to reach server, please try again.");
    }
  }

  useEffect(() => setSelectedRoles(user.roles), [user]);

  return (
    <>
      <Modal
        className="add_roles_modal"
        overlayClassName="add_roles_modal_overlay"
        isOpen={open}
        onRequestClose={() => setOpen(false)}
        contentLabel="Add Roles Modal"
      >
        <button
          className="roles_close_button"
          aria-label="roles_close_button"
          type="button"
          onClick={() => setOpen(false)}
        />
        <form className="add_roles_form" onSubmit={(e) => addRoles(e)}>
          <h2>Assign Role</h2>
          {ROLES.map((role) => (
            <div key={role.name} className="role_choice">
              <label htmlFor={role.name}>
                <input
                  type="checkbox"
                  id={role.name}
                  checked={selectedRoles.includes(role.name)}
                  onChange={(e) => {
                    if (e.target.checked) addRole(role.name);
                    else deleteRole(role.name);
                  }}
                />
                {role.name}
              </label>
            </div>
          ))}
          <p className="admin_roles_separator">Admin</p>
          <div className="role_choice">
            <label htmlFor="primary_admin">
              <input
                type="checkbox"
                id="primary_admin"
                checked={selectedAdmin === 2}
                onChange={(e) => setSelectedAdmin(e.target.checked ? 2 : 0)}
              />
              Primary Admin
            </label>
          </div>
          <div className="role_choice">
            <label htmlFor="secondary_admin">
              <input
                type="checkbox"
                id="secondary_admin"
                checked={selectedAdmin >= 1}
                onChange={(e) => {
                  switch (selectedAdmin) {
                    case 0: /* Fall through */
                    case 1:
                      setSelectedAdmin(e.target.checked ? 1 : 0);
                      break;
                    case 2:
                      setSelectedAdmin(e.target.checked ? 2 : 0);
                  }
                }}
              />
              Secondary Admin
            </label>
          </div>
          <button className="modal-button button-primary" type="submit">
            Assign
          </button>
        </form>
      </Modal>
      <Modal
        className="delete_confirmation_modal"
        overlayClassName="add_roles_modal_overlay"
        isOpen={Boolean(errorOpen)}
        onRequestClose={() => setErrorOpen(false)}
        contentLabel="Error Modal"
      >
        <button
          className="close_button_delete"
          aria-label="close_button_delete"
          type="button"
          onClick={() => setErrorOpen(false)}
        />
        <p>Error: {errorOpen}</p>
      </Modal>
    </>
  );
}
