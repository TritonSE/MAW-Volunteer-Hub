import React from "react";
import "../styles/AssignBtn.css";

function AssignBtn({ label, onClick, onDelete, admin, profilePage }) {
  function btnType() {
    switch (label) {
      case "Assign Role":
        return "btn_assign btn_assignrole";
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

  if (admin) {
    return (
      <div className={`assign_btn_layout ${btnType()}`}>
        <button type="button" className="hover" onClick={() => onClick()}>
          {label}
        </button>
        {profilePage ? (
          <button type="button" className="delete_role hover" onClick={() => onDelete()} />
        ) : null}
      </div>
    );
  }
  return <div className={`assign_btn_layout ${btnType()}`}>{label}</div>;
}
export default AssignBtn;
