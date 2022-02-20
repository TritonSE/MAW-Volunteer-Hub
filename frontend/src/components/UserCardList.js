import React, { useState } from "react";
import "../styles/UserCardList.css";

function UserCard({ user }) {
  const handleNameClick = () => {
    alert(user.Name + " was clicked");
  };

  return (
    <div className="user_card" key={Math.random()}>
      <div className="card_col">
        <button
          className="card_item_top"
          aria-label="user_profile"
          type="button"
          onClick={() => handleNameClick()}
        >
          {user.Name}
        </button>
        <div className="card_item_bottom">Assignments Completed: {user.Completed}</div>
      </div>
      <div className="card_col">
        <div className="card_item_top">{user.Roles}</div>
        <div className="card_item_bottom">Volunteer Start: {user.Start}</div>
      </div>
    </div>
  );
}

function UserCardList({ userData }) {
  const [showAdmin, setShowAdmin] = useState(false);

  const separateAdmin = (userName) => {
    let isAdmin = false;

    for (let i = 0; i < userData.length; i++) {
      if (userData[i].Name === userName) {
        isAdmin = userData[i].Admin;
      }
    }

    if (isAdmin && showAdmin) {
      return true;
    }

    if (!isAdmin && !showAdmin) {
      return true;
    }

    return false;
  };

  const getButtonHeader = (ind) => {
    if ((ind === 0 && !showAdmin) || (ind === 1 && showAdmin)) {
      return "_selected";
    }

    return "";
  };

  return (
    <div className="user_mobile_display">
      <div className="user_toggle">
        <button
          className={`toggle_btn${getButtonHeader(0)}`}
          type="button"
          aria-label="volunteer"
          onClick={() => setShowAdmin(false)}
        >
          Volunteers
        </button>
        <button
          className={`toggle_btn${getButtonHeader(1)}`}
          type="button"
          aria-label="volunteer"
          onClick={() => setShowAdmin(true)}
        >
          Admin
        </button>
        <button className={`toggle_btn${getButtonHeader(2)}`} type="button" aria-label="volunteer">
          Deactivated
        </button>
      </div>
      <div className="card_list">
        {userData.map((user) =>
          separateAdmin(user.Name) ? <UserCard user={user} key={Math.random()} /> : null
        )}
      </div>
    </div>
  );
}

export default UserCardList;
