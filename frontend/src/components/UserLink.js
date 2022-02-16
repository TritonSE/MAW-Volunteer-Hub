import React from "react";

function UserLink({ userName }) {
  const handleNameClicked = () => {
    alert(userName + " was clicked");
  };
  return <button type="button" aria-label={userName} onClick={() => handleNameClicked()} />;
}

export default UserLink;
