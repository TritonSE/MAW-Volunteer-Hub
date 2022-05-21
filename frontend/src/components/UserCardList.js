import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SITE_PAGES } from "../constants/links";
import "../styles/UserCardList.css";

function UserCard({
  user,
  row,
  VerifyButtonCell,
  updateMyData,
  // updateMyRoles,
  handleConfirmationModal,
}) {
  return (
    <div className="user_card" key={Math.random()}>
      <div className="card_col">
        <Link
          className="card_item_top"
          aria-label="user_profile"
          to={`${SITE_PAGES.PROFILE}/${user._id}`}
          target="_blank"
        >
          {user.name}
        </Link>
        <div className="card_item_bottom">Assignments Completed: {user.completed ?? "N/A"}</div>
      </div>
      <div className="card_col">
        {/* <div className="card_item_top">{user.roles}</div> */}
        <VerifyButtonCell
          row={{ index: row }}
          column={{ id: "verified" }}
          handleConfirmationModal={handleConfirmationModal}
          updateMyData={updateMyData}
          // updateMyRoles={updateMyRoles}
          isVerified={user.verified}
          name={user.name}
          roles={user.roles}
          user_id={user._id}
          admin={user.admin}
        />
        <div className="card_item_bottom">Volunteer Start: {user.start ?? "N/A"}</div>
      </div>
    </div>
  );
}

function UserCardSearch({ filter, setFilter }) {
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setFilter(filter);
    }
  };
  return (
    <div className="search_bar_container_mobile">
      <div className="user_search_bar_mobile">
        <input
          className="user_search_input_mobile"
          value={filter || ""}
          onChange={(e) => {
            setFilter(e.target.value);
          }}
          onKeyDown={handleKeyPress}
          placeholder="Search by name"
        />
        <button
          className="user_search_button_mobile"
          type="button"
          aria-label="Search"
          onClick={() => {
            setFilter(filter);
          }}
        />
      </div>
    </div>
  );
}

function UserCardList({ userData, filter, setFilter, ...props }) {
  const [showAdmin, setShowAdmin] = useState(false);

  // Separates admins from volunteers
  const separateAdmin = (id) => {
    let isAdmin = false;

    for (let i = 0; i < userData.length; i++) {
      if (userData[i]._id === id) {
        isAdmin = userData[i].admin === 1 || userData[i].admin === 2;
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
  // Mainly considers the name search variable stored in filter
  const displayUser = (id, userName) => {
    if (userName && filter !== "") {
      if (separateAdmin(id) && userName.toLowerCase().includes(filter.toLowerCase())) {
        return true;
      }

      return false;
    }

    return separateAdmin(id);
  };

  const getButtonHeader = (ind) => {
    if ((ind === 0 && !showAdmin) || (ind === 1 && showAdmin)) {
      return " selected";
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
          Admins
        </button>
        {/* <button className={`toggle_btn${getButtonHeader(2)}`} type="button" aria-label="volunteer">
          Deactivated
        </button> */}
      </div>
      <UserCardSearch filter={filter} setFilter={setFilter} />
      <div className="card_list">
        {userData.map(
          (user, i) =>
            displayUser(user._id, user.name) && (
              <UserCard user={user} key={Math.random()} row={i} {...props} />
            )
        )}
      </div>
    </div>
  );
}

export default UserCardList;
