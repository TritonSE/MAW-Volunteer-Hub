import React from "react";
import "../styles/ProfileCompleted.css";

export default function ProfileCompleted(props) {
  return (
    <div className="assign_completed">
      <h2>Assignments Completed </h2>
      <p className="task_number">{props.tasks}</p>
    </div>
  );
}