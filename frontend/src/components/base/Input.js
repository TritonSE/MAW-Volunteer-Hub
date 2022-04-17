/* eslint react/jsx-props-no-spreading: "off" */
import React from "react";
import "../../styles/base/Input.css";

/**
 * Variants:
 *  - (Default): Standard field from Figma, white background with black border
 *  - underline: Alternative field used by calendar modals
 */
export default function Input(props) {
  return (
    <input
      {...props}
      type={props?.type ?? "text"}
      className={`maw-ui_input ${props?.className ?? ""} ${props?.variant ?? ""}`}
    />
  );
}
