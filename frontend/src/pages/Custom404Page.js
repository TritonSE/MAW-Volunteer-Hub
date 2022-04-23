import React, { useEffect } from "react";
import history from "../history";

function Custom404Page() {
  useEffect(() => {
    document.title = "Page Not Found - Make-a-Wish San Diego";
  }, []);

  return (
    <div className="center" style={{ height: "calc(100vh - 150px)" }}>
      <div>
        <img alt="Make-a-Wish logo" src="/img/login_logo.svg" className="logo" />
        <h1>404</h1>
        <h3>Page not found</h3>
        <button className="maw-ui_button primary" type="button" onClick={history.back}>
          Go back
        </button>
      </div>
    </div>
  );
}

export default Custom404Page;
