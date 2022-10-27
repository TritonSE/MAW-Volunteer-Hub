import React, { useEffect, useState } from "react";
import "../styles/HomePage.css";
import parse from "html-react-parser";
import { api_wish_wednesday } from "../api";

function HomePage() {
  const [message, setMessage] = useState("");
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Home - Make-a-Wish San Diego";

    async function fetch_wish_wed() {
      const res = await api_wish_wednesday();
      if (res && !res.error && res?.length > 0) {
        setMessage(res[0]?.message);
        setDate(new Date(res[0]?.createdAt));
        setLoading(false);
      }
    }

    fetch_wish_wed();
  }, []);

  return (
    <div className="home-container">
      <div className="top-header">
        <h1 className="top-title">Make-A-Wish</h1>
        <img src="/img/Mountain.png" alt="Make a Wish background" />
      </div>
      {!loading && (
        <div>
          <h2 id="wish-wednesday-title">
            Wish Wednesday [{date.toLocaleDateString("en-US")}]
            {/*
              Temporarily removed due to unspecified functionality
              <button className="edit-button" type="submit">
                <img src="img/edit_icon.svg" alt="edit" style={{ height: "20px" }} />
              </button> 
            */}
          </h2>
          <div id="wish-wednesday-post">{parse(message)}</div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
