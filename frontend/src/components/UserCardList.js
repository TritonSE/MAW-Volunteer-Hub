import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SITE_PAGES } from "../constants/links";
import "../styles/UserCardList.css";

function UserCard({ user, row, VerifyButtonCell, updateMyData, handleConfirmationModal }) {
  return (
    <div className="user_card">
      <div className="card_col column">
        <Link
          className="card_item_top column"
          aria-label="user_profile"
          to={`${SITE_PAGES.PROFILE}/${user._id}`}
          target="_blank"
        >
          {user.name}
        </Link>
        <div className="card_item_bottom column">
          Assignments Completed: {user.completed ?? "N/A"}
        </div>
      </div>
      <div className="card_col column">
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

  return (
    <div className="user_mobile_display column">
      <div className="user_toggle">
        <button
          className={`toggle_btn ${!showAdmin ? "selected" : ""}`}
          type="button"
          aria-label="volunteer"
          onClick={() => setShowAdmin(false)}
        >
          Volunteers
        </button>
        <button
          className={`toggle_btn ${showAdmin ? "selected" : ""}`}
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
      <div className="card_list column">
        {userData
          .filter(
            (user) =>
              user.name &&
              user.name.toLowerCase().includes(filter.toLowerCase()) &&
              user.admin === showAdmin
          )
          .map((user, i) => (
            <UserCard key={user._id} user={user} row={i} {...props} />
          ))}
      </div>
    </div>
  );
}

export default UserCardList;
