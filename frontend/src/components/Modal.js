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
      className={`maw-ui_modal ${props?.className ?? ""}`}
      overlayClassName={`maw-ui_modal-overlay ${props?.overlayClassName ?? ""}`}
    >
      <div className="maw-ui_modal-container">
        {props?.title && (
          <div className="maw-ui_modal-header">
            <h3>{props.title}</h3>
            {props?.hasClose !== false && (
              <button type="button" onClick={() => props.onRequestClose()}>
                <img src="/img/wishgranting_modal_close.svg" alt="Close modal" />
              </button>
            )}
          </div>
        )}
        <div className="maw-ui_modal-content">{props?.children}</div>
        {props?.actionButton && (
          <div className="maw-ui_modal-footer">
            <button type="button" className="maw-ui_button primary" {...props?.actionButtonProps}>
              {props.actionButton}
            </button>
          </div>
        )}
      </div>
    </ReactModal>
  );
}
