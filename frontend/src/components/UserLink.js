import React from "react";
import "../styles/UserLink.css";

// Handles any actions that should take place when a user's name in the userlist is clicked.
function UserLink({ userName }) {
  const handleNameClicked = () => {
    alert(userName + " was clicked");
  };
  return (
    <button
      className="user_list_name_btn"
      type="button"
      aria-label={userName}
      onClick={() => handleNameClicked()}
    >
      {userName}
    </button>
  );
}

export default UserLink;
