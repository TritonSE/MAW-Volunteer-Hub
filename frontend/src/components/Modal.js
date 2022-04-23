/* eslint react/jsx-props-no-spreading: "off" */
import React from "react";
import ReactModal from "react-modal";

ReactModal.setAppElement(document.getElementById("root"));

/**
 * A wrapper around react-modal to add extra
 *   functionality and configurability
 */
export default function Modal(props) {
  return (
    <ReactModal
      {...props}
      className={`maw-ui_modal ${props?.className ?? ""} ${props?.variant ?? ""}`}
      overlayClassName={`maw-ui_modal-overlay ${props?.overlayClassName ?? ""}`}
    >
      <div className={`maw-ui_modal-container ${props?.className ?? ""} ${props?.variant ?? ""}`}>
        {props?.children}
      </div>
    </ReactModal>
  );
}
