import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SITE_PAGES } from "../constants/links";
import { api_reset } from "../api";
import "../styles/ResetPage.css";

function PasswordField({ name, placeholder, onChange }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="maw-ui_input">
      <input
        name={name}
        placeholder={placeholder}
        className="maw-ui_input"
        type={isVisible ? "text" : "password"}
        onChange={onChange}
      />
      <button
        type="button"
        className="unstyled"
        onClick={() => setIsVisible(!isVisible)}
        tabIndex={-1}
      >
        <img
          alt="Toggle password visibility"
          src={isVisible ? "/img/login_visible.svg" : "/img/login_notvisible.svg"}
          className={"login_password_eye" + (isVisible ? " visible" : "")}
        />
      </button>
    </div>
  );
}

export default function ResetPage() {
  const { code } = useParams();

  const [flowState, setFlowState] = useState(0);
  const [password, setPassword] = useState("");
  const [cPass, setCPass] = useState("");
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    document.title = "Reset Password - Make-a-Wish San Diego";
  }, []);

  async function handle_submit(e) {
    e.preventDefault();
    setErrorMessage();

    const res = await api_reset({ code, password });
    if (res && !res.error) {
      setFlowState(1);
    } else {
      setErrorMessage(res.error ?? "Unable to reach server, please try again.");
    }
  }

  function validate() {
    return password.trim().length > 0 && password === cPass;
  }

  return (
    <div className="reset_page">
      <form className="box" onSubmit={handle_submit} method="POST">
        <div
          className="slider column fullheight"
          style={{
            right: flowState === 0 ? "0" : "350px",
          }}
        >
          <div className="center column">
            <div className="icon" />
            <h2>Reset Password</h2>
          </div>
          <PasswordField
            name="password"
            placeholder="New password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <PasswordField
            placeholder="Re-enter new password"
            onChange={(e) => setCPass(e.target.value)}
          />
          <div
            className="errorbox center"
            style={{ visibility: errorMessage ? "visible" : "hidden" }}
          >
            {errorMessage}
          </div>
          <button type="submit" className="maw-ui_button primary fullwidth" disabled={!validate()}>
            Reset
          </button>
        </div>
        <div
          className="slider column fullheight"
          style={{
            top: "-300px",
            left: flowState === 0 ? "350px" : "0",
          }}
        >
          <div className="center column fullheight">
            <h2>Successfully changed password!</h2>
            <br />
            <a href={SITE_PAGES.LOGIN}>
              <button type="button" className="maw-ui_button primary padded">
                Return to login
              </button>
            </a>
            <br />
            <br />
          </div>
        </div>
      </form>
    </div>
  );
}
