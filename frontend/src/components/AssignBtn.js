import React from "react";
import "../styles/AssignBtn.css";

function AssignBtn({ label }) {
  function btnType() {
    switch (label) {
      case "Assign Role":
        return "btn_assign";
      case "Airport Greeter":
        return "btn_aGreeter";
      case "Wish Granter":
        return "btn_wGranter";
      case "Meeter":
        return "btn_meeter";
    }
    return "btn_none";
  }
  return (
    <button type="button" className={btnType()}>
      {label}
    </button>
  );
}
export default AssignBtn;
