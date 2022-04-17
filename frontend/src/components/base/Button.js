/* eslint react/jsx-props-no-spreading: "off", react/button-has-type: "off" */
import React from "react";
import "../../styles/base/Button.css";

/**
 * Variants:
 *  - (Default): White background, black border
 *  - primary: Blue background, no border
 *  - error: Red background, no border
 *  - fullwidth: Button fills container
 */
export default function Button(props) {
  return (
    <button
      {...props}
      type={props?.type ?? "button"}
      className={`maw-ui_button ${props?.className ?? ""} ${props?.variant ?? ""}`}
    >
      {props?.children}
    </button>
  );
}
