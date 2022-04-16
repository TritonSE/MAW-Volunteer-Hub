import React from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import AssignBtn from "./AssignBtn";

import "../styles/ProfileRoles.css";

export default function ProfileRoles(props) {
  const addRoles = () => {
    alert("Add Roles");
  };

  return (
    <div className="roles_container">
      <div className="roles_header">
        <h2>Role</h2>
        {/* Taken from ProfilePage.js and ProfilePage.css */}
        <button type="button" className="add_roles" onClick={() => addRoles()}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
          </svg>
        </button>
      </div>

      <ScrollContainer className="roles_scroller" vertical={false}>
        {props.roles.length > 0
          ? props.roles.map((role) => (
              <AssignBtn
                label={role}
                key={Math.random()}
                onClick={() => alert(role + " clicked")}
              />
            ))
          : ["No Roles"]}
      </ScrollContainer>
    </div>
  );
}
