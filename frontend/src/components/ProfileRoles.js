import React, { useState } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import AssignBtn from "./AssignBtn";
import RolesModal from "./RolesModal";

import "../styles/ProfileRoles.css";

export default function ProfileRoles(props) {
  const [rolesModalOpen, setRolesModalOpen] = useState(false);

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

      <RolesModal
        open={rolesModalOpen}
        setOpen={setRolesModalOpen}
        roles={props.roles}
        id={props.id}
      />
    </div>
  );
}
