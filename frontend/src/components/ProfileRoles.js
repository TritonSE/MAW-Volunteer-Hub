import React, { useState } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import Modal from "react-modal";
import AssignBtn from "./AssignBtn";
import RolesModal from "./RolesModal";
import { api_update_roles } from "../auth";

import "../styles/ProfileRoles.css";

export default function ProfileRoles(props) {
  const [rolesModalOpen, setRolesModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletedRole, setDeletedRole] = useState("");

  function deleteRole(role) {
    const newRoles = props.roles.filter((aRole) => aRole !== role);
    api_update_roles(props.id, JSON.stringify(newRoles));
    setDeletedRole(role);
    setDeleteModalOpen(true);
  }

  function closeAndRefresh() {
    setDeleteModalOpen(false);
    document.location.reload();
  }

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
                // Display role description when volunteers click?
                onClick={props.admin ? () => setRolesModalOpen(true) : null}
                onDelete={() => deleteRole(role)}
                admin={props.admin}
              />
            ))
          : ["No Roles"]}
      </ScrollContainer>

      <RolesModal
        open={rolesModalOpen}
        setOpen={setRolesModalOpen}
        roles={props.roles}
        id={props.id}
      />

      <Modal
        className="delete_confirmation_modal"
        overlayClassName="add_roles_modal_overlay"
        isOpen={deleteModalOpen}
        onRequestClose={() => closeAndRefresh()}
        contentLabel="Delete Confirmation Modal"
      >
        <button
          className="close_button_delete"
          aria-label="close_button_delete"
          type="button"
          onClick={() => closeAndRefresh()}
        />
        <p>{"The `" + deletedRole + "` role has been removed"}</p>
      </Modal>
    </div>
  );
}
