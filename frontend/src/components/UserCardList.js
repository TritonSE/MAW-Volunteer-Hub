import React from "react";
import "../styles/UserCardList.css";

function UserCard({ user }) {
  return (
    <div className="user_card" key={Math.random()}>
      <div className="card_col">
        <div className="card_item_top">{user.NameString}</div>
        <div className="card_item_bottom">{user.Completed}</div>
      </div>
      <div className="card_col">
        <div className="card_item_top">{user.Roles}</div>
        <div className="card_item_bottom">{user.Start}</div>
      </div>
    </div>
  );
}

function UserCardList({ userData }) {
  return (
    <div className="card_list">
      {userData.map((user) => (
        <UserCard user={user} key={Math.random()} />
      ))}
    </div>
  );
}

export default UserCardList;
