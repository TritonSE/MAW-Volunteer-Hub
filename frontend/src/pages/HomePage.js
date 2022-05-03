import React, { useState } from "react";
import "../styles/HomePage.css";
import { api_wish_wednesday } from "../api";

function HomePage({ date }) {
  const [message, setmessage] = useState("");
  const set = () =>
    setmessage(api_wish_wednesday().message)
      ? api_wish_wednesday()
      : setmessage("Something Went Wrong");

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
        <p>{message}</p>
      </div>
    </div>
  );
}

HomePage.defaultProps = {
  date: "mm/dd/yyyy",
};

export default HomePage;
