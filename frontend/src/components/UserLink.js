import React from "react";
import "../styles/UserLink.css";

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
