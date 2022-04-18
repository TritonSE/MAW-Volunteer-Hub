import React from "react";
import "../styles/HomePage.css";

function HomePage({ text, date }) {
  return (
    <div className="home-container">
      <div className="top-header">
        <h1 className="top-title">Make-A-Wish</h1>
        <img src="/img/Mountain.png" alt="Make a Wish background" />
      </div>
      <div>
        <p id="wish-wednesday-title">
          Wish Wednesday [{date}]
          <button className="edit-button" type="submit">
            <img src="img/edit_icon.svg" alt="edit" style={{ height: "20px" }} />
          </button>
        </p>
        <img src="/img/filler-img.png" alt="Wish wednesday header" className="body-image" />
        <p>{text}</p>
      </div>
    </div>
  );
}

HomePage.defaultProps = {
  text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
  date: "mm/dd/yyyy",
};

export default HomePage;
