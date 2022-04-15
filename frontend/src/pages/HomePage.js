import React from "react";
import "../styles/HomePage.css";

function HomePage({ text, date }) {
  return (
    <>
      <br />
      <div className="Top_header">
        <h1 className="Top_title">Make-A-Wish</h1>
      </div>

      <div className="center">
        <p id="wish">
          Wish Wednesday [{date}] <button className="Edit_button" type="submit" />{" "}
        </p>
        <div className="image_body" />
        <p>{text}</p>
      </div>
    </>
  );
}

HomePage.defaultProps = {
  text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
  date: "mm/dd/yyyy",
};

export default HomePage;
