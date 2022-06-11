import React from "react";
import "../styles/AssignBtn.css";

function AssignBtn({ label, onClick, onDelete, admin, active, profilePage }) {
  function btnType() {
    switch (label) {
      case "Assign Role":
        return "btn_assign btn_role";
      case "Wish Granter":
        return "btn_assign btn_wGranter";
      case "Airport Greeter":
        return "btn_assign btn_aGreeter";
      case "Mentor":
        return "btn_assign btn_mentor";
      case "Volunteer":
        return "btn_assign btn_volunteer";
      case "Office":
        return "btn_assign btn_office";
      case "Special Events":
        return "btn_assign btn_speciale";
      case "Translator":
        return "btn_assign btn_translator";
      case "Speaker's Bureau":
        return "btn_assign btn_speaker";
      case "Las Estrellas":
        return "btn_assign btn_las";
      case "Allow Access":
        return "btn_assign btn_access";
      case "Primary Admin":
        return "btn_assign btn_pAdmin";
      case "Secondary Admin":
        return "btn_assign btn_sAdmin";
    }
    return "btn_assign btn_none";
  }

  return (
    <div>
      {admin ? (
        <div className="assign_btn_layout">
          <button type="button" disabled={!active} className={btnType()} onClick={() => onClick()}>
            {label}
          </button>
          {profilePage ? (
            <button
              type="button"
              disabled={!active}
              className="delete_role"
              onClick={() => onDelete()}
            >
              x
            </button>
          ) : null}
        </div>
      ) : (
        <div className={btnType() + " no_hover"}>{label}</div>
      )}
    </div>
  );
}
export default AssignBtn;
