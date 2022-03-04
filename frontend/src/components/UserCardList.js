import React, { useState } from "react";
import "../styles/UserCardList.css";

function UserCard({ user, row, VerifyButtonCell, updateMyData, handleConfirmationModal }) {
  return (
    <div className="user_card" key={Math.random()}>
      <div className="card_col">
        <a
          className="card_item_top"
          aria-label="user_profile"
          target="blank_"
          href={`/profile/${user._id}`}
        >
          {user.name}
        </a>
        <div className="card_item_bottom">Assignments Completed: {user.completed ?? "N/A"}</div>
      </div>
      <div className="card_col">
        {/* <div className="card_item_top">{user.roles}</div> */}
        <VerifyButtonCell
          row={{ index: row }}
          column={{ id: "verified" }}
          handleConfirmationModal={handleConfirmationModal}
          updateMyData={updateMyData}
          isVerified={user.verified}
          name={user.name}
        />
        <div className="card_item_bottom">Volunteer Start: {user.start ?? "N/A"}</div>
      </div>
    </div>
  );
}

function UserCardSearch({ search }) {
  const [searchVal, setSearchVal] = useState("");

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      search(searchVal);
    }
  };
  return (
    <div className="search_bar_container">
      <div className="mobile_user_search_bar">
        <input
          className="mobile_user_search_input"
          value={searchVal || ""}
          onChange={(e) => {
            setSearchVal(e.target.value);
          }}
          onKeyPress={(e) => {
            handleKeyPress(e);
          }}
          placeholder="Search by name"
        />
        <button
          className="user_search_button"
          type="button"
          aria-label="Search"
          onClick={() => {
            search(searchVal);
          }}
        />
      </div>
    </div>
  );
}

function UserCardList({ userData, ...props }) {
  const [showAdmin, setShowAdmin] = useState(false);
  const [searchUsers, setSearchUser] = useState("");
  // Separates admins from volunteers
  const separateAdmin = (id) => {
    let isAdmin = false;

    for (let i = 0; i < userData.length; i++) {
      if (userData[i]._id === id) {
        isAdmin = userData[i].admin;
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

  // Determine if a user should be displayed.
  // Mainly considers the name search variable stored in searchUsers
  const displayUser = (id, email) => {
    if (searchUsers !== "") {
      if (separateAdmin(id) && email.toLowerCase().includes(searchUsers.toLowerCase())) {
        return true;
      }

      return false;
    }

    return separateAdmin(id);
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
      <UserCardSearch search={setSearchUser} />
      <div className="card_list">
        {userData.map(
          (user, i) =>
            displayUser(user._id, user.email) && (
              <UserCard user={user} key={Math.random()} row={i} {...props} />
            )
        )}
      </div>
    </div>
  );
}

export default UserCardList;
