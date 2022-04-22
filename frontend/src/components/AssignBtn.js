import React from "react";
import "../styles/AssignBtn.css";

function AssignBtn({ label, onClick }) {
  function btnType() {
    switch (label) {
      case "Assign Role":
        return "btn_assign btn_role";
      case "Airport Greeter":
        return "btn_assign btn_aGreeter";
      case "Wish Granter":
        return "btn_assign btn_wGranter";
      case "Meeter":
        return "btn_assign btn_meeter";
      case "Allow Access":
        return "btn_assign btn_access";
    }
    return "btn_assign btn_none";
  }

  return (
    <button type="button" className={btnType()} onClick={() => onClick()}>
      {label}
    </button>
  );
}
export default AssignBtn;
