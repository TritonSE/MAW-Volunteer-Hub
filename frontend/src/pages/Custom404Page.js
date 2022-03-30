import React, { useEffect } from "react";
import history from "../history";
import "../styles/Custom404Page.css";

function Custom404Page() {
  useEffect(() => {
    document.title = "Page Not Found - Make-a-Wish San Diego";
  }, []);

  return (
    <div className="notfound_flex_center">
      <div>
        <img alt="Make-a-Wish logo" src="/img/login_logo.svg" className="logo" />
        <h1>404</h1>
        <h3>Page not found</h3>
        <button type="button" onClick={history.back}>
          Go back
        </button>
      </div>
    </div>
  );
}

export default Custom404Page;
