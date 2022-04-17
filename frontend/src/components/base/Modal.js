/* eslint react/jsx-props-no-spreading: "off" */
import React from "react";
import ReactModal from "react-modal";
import "../../styles/base/Modal.css";

ReactModal.setAppElement(document.getElementById("root"));

/**
 * Variants:
 *  - (Default): 466px x 278px modal
 *  - thin: 466px x 202px modal
 *  - center: Centered contents
 *  - column: Columnal contents
 */
export default function Modal(props) {
  return (
    <ReactModal
      {...props}
      className={`maw-ui_modal ${props?.className ?? ""} ${props?.variant ?? ""}`}
      overlayClassName={`maw-ui_modal-overlay ${props?.overlayClassName ?? ""}`}
    >
      <div className={`maw-ui_modal-container ${props?.variant ?? ""}`}>{props?.children}</div>
    </ReactModal>
  );
}
