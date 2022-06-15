import React, { useContext } from "react";
import ROLES from "../constants/roles";
import { CurrentUser } from "./Contexts";
import "../styles/AssignBtn.css";

function AssignBtn({ label, onClick, onDelete, profilePage }) {
  const [currentUser] = useContext(CurrentUser);

  let role = ROLES.find((tmp) => label === tmp.name);
  if (!role && label !== "Assign Role") {
    role = { color: "#bada55" };
  }

  return (
    <div
      className={`assign_btn_layout btn_assign ${label === "Assign Role" ? "btn_assignrole" : ""}`}
      style={
        role && {
          border: `1px solid ${role.color}`,
          padding: currentUser.admin === 2 ? null : "6px 15px",
        }
      }
    >
      {currentUser.admin === 2 ? (
        <>
          <button type="button" className="hover" onClick={() => onClick()}>
            {label}
          </button>
          {profilePage && (
            <button type="button" className="delete_role hover" onClick={() => onDelete()}>
              &nbsp;
            </button>
          )}
        </>
      ) : (
        label
      )}
    </div>
  );
}
export default AssignBtn;
