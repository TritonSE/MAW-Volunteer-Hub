import React, { useEffect, useState } from "react";
import "../styles/HomePage.css";
import { api_wish_wednesday } from "../api";

function HomePage() {
  const [message, setMessage] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api_wish_wednesday().then((res) => {
      setMessage(res[0].message || "");
      setDate(res[0].createdAt || "");
      setLoading(false);
    });
  }, []);

  return (
    <div className="home-container">
      <div className="top-header">
        <h1 className="top-title">Make-A-Wish</h1>
        <img src="/img/Mountain.png" alt="Make a Wish background" />
      </div>
      {!loading && (
        <div>
          <p id="wish-wednesday-title">
            Wish Wednesday [{new Date(date).toLocaleDateString("en-US")}]
            {/*
              Temporarily removed due to unspecified functionality
              <button className="edit-button" type="submit">
                <img src="img/edit_icon.svg" alt="edit" style={{ height: "20px" }} />
              </button> 
            */}
          </p>
          <img src="/img/filler-img.png" alt="Wish wednesday header" className="body-image" />
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}

export default HomePage;
