import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SITE_PAGES } from "../constants/links";
import "../styles/UserCardList.css";

function UserCard({ user, row, VerifyButtonCell, updateMyData }) {
  const sum =
    user.events.reduce(
      (prev, next) =>
        prev +
        Object.entries(next.repetitions).reduce(
          (subprev, [date, subnext]) =>
            subprev +
            (new Date(date).setHours(
              new Date(next.to).getHours(),
              new Date(next.to).getMinutes()
            ) <= Date.now() && Object.prototype.hasOwnProperty.call(subnext.attendees, user._id)),
          0
        ),
      0
    ) + user.manualEvents.filter((evt) => new Date(evt.date).getTime() <= Date.now()).length;

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
        <div className="card_item_bottom">Assignments Completed: {sum ?? "N/A"}</div>
      </div>
      <div className="card_col">
        {/* <div className="card_item_top">{user.roles}</div> */}
        <VerifyButtonCell row={{ index: row }} updateMyData={updateMyData} user={user} />
        <div className="card_item_bottom">
          Volunteer Since:{" "}
          {new Date(user.createdAt).toLocaleString("default", {
            month: "short",
            year: "numeric",
          }) ?? "N/A"}
        </div>
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
  const [showTab, setShowTab] = useState(0);

  // Separates admins from volunteers
  const do_filter = () =>
    userData.filter((user) => {
      if (!user.name.toLowerCase().includes(filter.toLowerCase())) {
        return false;
      }

      switch (showTab) {
        case 0:
          return user.active && !user.admin;
        case 1:
          return user.active && user.admin;
        default:
          return !user.active;
      }
    });

  return (
    <div className="user_mobile_display">
      <div className="user_toggle">
        <button
          className={`toggle_btn ${showTab === 0 ? "selected" : ""}`}
          type="button"
          aria-label="volunteer"
          onClick={() => setShowTab(0)}
        >
          Volunteers
        </button>
        <button
          className={`toggle_btn ${showTab === 1 ? "selected" : ""}`}
          type="button"
          aria-label="volunteer"
          onClick={() => setShowTab(1)}
        >
          Admins
        </button>
        <button
          className={`toggle_btn ${showTab === 2 ? "selected" : ""}`}
          type="button"
          aria-label="deactivated"
          onClick={() => setShowTab(2)}
        >
          Deactivated
        </button>
        {/* <button className={`toggle_btn${getButtonHeader(2)}`} type="button" aria-label="volunteer">
          Deactivated
        </button> */}
      </div>
      <UserCardSearch filter={filter} setFilter={setFilter} />
      <div className="card_list">
        {do_filter().map((user, i) => (
          <UserCard user={user} key={Math.random()} row={i} {...props} />
        ))}
      </div>
    </div>
  );
}

export default UserCardList;
