import React, { useState, useContext } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import Modal from "react-modal";
import AssignBtn from "./AssignBtn";
import RolesModal from "./RolesModal";
import { api_update_roles } from "../api";
import { CurrentUser } from "./Contexts";

import "../styles/ProfileRoles.css";

export default function ProfileRoles({ user, active, onRolesChange }) {
  const [rolesModalOpen, setRolesModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletedRole, setDeletedRole] = useState("");

  const [currentUser] = useContext(CurrentUser);

  async function deleteRole(role, newAdmin = user.admin) {
    const newRoles = user.roles.filter((aRole) => aRole !== role);
    const res = await api_update_roles(user._id, JSON.stringify(newRoles), newAdmin);
    if (res && !res.error) {
      onRolesChange(newRoles);
      setDeletedRole(role);
      setDeleteModalOpen(true);
    } else {
      setDeleteModalOpen(res.error ?? "Unable to reach server, please try again.");
    }
  }

  return (
    <div className="roles_container">
      <div className="roles_header">
        <h2>Roles</h2>
        {/* Taken from ProfilePage.js and ProfilePage.css */}
        {currentUser.admin === 2 ? (
          <button
            type="button"
            disabled={!active}
            className="add_roles"
            onClick={() => setRolesModalOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
            </svg>
          </button>
        ) : (
          <div />
        )}
      </div>

      <ScrollContainer className="roles_scroller" vertical={false}>
        {user.roles.length > 0 || user.admin > 0 ? (
          <>
            {user.roles.map((role) => (
              <AssignBtn
                key={role}
                label={role}
                onClick={currentUser.admin === 2 ? () => setRolesModalOpen(true) : null}
                onDelete={() => deleteRole(role)}
                active={user.active}
                profilePage
              />
            ))}
            {user.admin >= 1 && (
              <AssignBtn
                label="Primary Admin"
                onClick={currentUser.admin === 2 ? () => setRolesModalOpen(true) : null}
                onDelete={() => deleteRole(null, 0)}
                active={user.active}
                profilePage
              />
            )}
            {user.admin === 2 && (
              <AssignBtn
                label="Secondary Admin"
                onClick={currentUser.admin === 2 ? () => setRolesModalOpen(true) : null}
                onDelete={() => deleteRole(null, 1)}
                active={user.active}
                profilePage
              />
            )}
          </>
        ) : (
          ["No Roles"]
        )}
      </ScrollContainer>

      <RolesModal
        open={rolesModalOpen}
        setOpen={setRolesModalOpen}
        user={user}
        onRolesChange={onRolesChange}
      />

      <Modal
        className="delete_confirmation_modal"
        overlayClassName="add_roles_modal_overlay"
        isOpen={Boolean(deleteModalOpen)}
        onRequestClose={() => setDeleteModalOpen(false)}
        contentLabel="Delete Confirmation Modal"
      >
        <button
          className="close_button_delete"
          aria-label="close_button_delete"
          type="button"
          onClick={() => setDeleteModalOpen(false)}
        />
        <p>
          {deleteModalOpen === true
            ? 'The "' + deletedRole + '" role has been removed.'
            : `Error: ${deleteModalOpen}`}
        </p>
      </Modal>
    </div>
  );
}
