import React, { useState, useEffect, useContext, useRef } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { api_login, api_signup, api_forgot } from "../api";
import { SITE_PAGES } from "../constants/links";
import { CurrentUser } from "../components/Contexts";
import "../index.css";
import "../styles/LoginPage.css";

Modal.setAppElement("#root");

function PasswordField({ name, placeholder, className, onChange }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={className + " login_password"}>
      <input
        name={name}
        placeholder={placeholder}
        type={isVisible ? "text" : "password"}
        onChange={onChange}
      />
      <button
        type="button"
        className="login_unstyled"
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

function LoginPage() {
  const [_currentUser, setCurrentUser] = useContext(CurrentUser);

  // 0 is login, 1 is signup, 2 is forgotten password
  const [formFlow, setFormFlow] = useState(0);
  const [successState, setSuccessState] = useState(-1);
  const [modalOpen, setModalOpen] = useState([false, false, ""]);
  const [doRemember, setDoRemember] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rpassword, setRPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const emailRef = useRef();

  const navigate = useNavigate();

  function validate(is_submit = false) {
    // This is a very simple regex to avoid performance degradation
    //   on longer strings -- More complex validation is done server-
    //   side.
    const email_regex = /\S+@\S+\.\S+/;

    if (!is_submit) {
      switch (formFlow) {
        case 0:
          return email_regex.test(email) && password;
        case 1:
          return name && email_regex.test(email) && password && rpassword && password === rpassword;
        case 2:
          return email_regex.test(email);
      }
    }

    let errors_obj = {};

    switch (formFlow) {
      case 0:
        errors_obj = {
          email: !email_regex.test(email),
          password: !password.trim(),
        };
        break;
      case 1:
        errors_obj = {
          name: !name.trim(),
          ...errors_obj,
          rpassword: !rpassword.trim() || password !== rpassword,
        };
        break;
      case 2:
        errors_obj = {
          email: !email_regex.test(email),
        };
        break;
    }

    setErrors(errors_obj);
    return Object.values(errors_obj).indexOf(true) === -1;
  }

  async function handle_submit(e) {
    e.preventDefault();

    if (successState < 1) {
      if (!validate(true)) return;

      const formdata = Object.fromEntries(new FormData(e.target).entries());

      setIsWaiting(true);

      const res = await [api_login, api_signup, api_forgot][formFlow](formdata);
      const success = Boolean(res && res.success);
      setIsWaiting(false);

      switch (formFlow) {
        case 0:
          setSuccessState(success);

          if (res.user) {
            setCurrentUser(res.user);
            window.scrollTo(0, 0);
            navigate(SITE_PAGES.HOME);
          } else {
            setErrorMessage(res.error);
          }
          break;
        case 1:
          setSuccessState(-1);
          setModalOpen(
            success
              ? [
                  true,
                  false,
                  "Your account has been created! You should receive a sign-up confirmation email shortly. Once an administrator confirms, you will be notified via email and be able to access the website.",
                ]
              : [true, true, res.error]
          );
          break;
        case 2:
          if (success) {
            setSuccessState(-1);
            setFormFlow(0);
            setModalOpen([
              true,
              false,
              "Password reset requested successfully! You should receive a confirmation email shortly. Please follow the steps within it to reset your password.",
            ]);
          } else {
            setSuccessState(0);
            setErrorMessage(res?.error ? res.error : "Internal server error, please try again.");
          }
          break;
      }
    }
  }

  useEffect(() => {
    setSuccessState(-1);
  }, [email, password]);

  useEffect(() => {
    document.title = "Log In - Make-a-Wish San Diego";
  }, []);

  return (
    <div className="login">
      <img alt="Make-a-Wish Logo" src="/img/login_logo.png" className="login_logo" />
      <form className="login_box" onSubmit={handle_submit} method="POST">
        <div className="login_form">
          <input
            name="name"
            placeholder="Full Name"
            className={`
              ${formFlow !== 1 ? "hidden" : ""}
              ${errors.name ? "error" : ""}
            `}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            ref={emailRef}
            name="email"
            placeholder="Email"
            type="email"
            className={`
              ${errors.email ? "error" : ""}
            `}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setTooltipVisible(true)}
            onBlur={() => setTooltipVisible(false)}
          />
          {formFlow === 1 && (
            <div
              className="disclaimer_tooltip"
              style={{
                opacity: 0 + tooltipVisible,
                zIndex: tooltipVisible ? 999 : -1,
              }}
            >
              &#9432; By providing your email address, you are agreeing and opting-in to receive
              email communication from Make-A-Wish San Diego for messaging/announcements, event
              invitations/assignments, and account info.
            </div>
          )}
          <PasswordField
            name="password"
            className={`
              ${formFlow === 2 ? "hidden" : ""}
              ${errors.password ? "error" : ""}
            `}
            placeholder="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <PasswordField
            className={`
              ${formFlow !== 1 ? "hidden" : ""}
              ${errors.rpassword ? "error" : ""}
            `}
            placeholder="Re-enter password"
            type="password"
            onChange={(e) => setRPassword(e.target.value)}
          />
          <div className={"login_flex" + (formFlow === 0 ? "" : " hidden")}>
            <label htmlFor="remember" className="login_flex_center login_pointer">
              <input
                type="checkbox"
                id="remember"
                name="remember"
                checked={doRemember}
                onChange={(e) => setDoRemember(e.target.checked)}
              />
              Keep me signed in
            </label>
            <a href="#forgot" onClick={() => setFormFlow(2)}>
              Forgot password
            </a>
            <span>&nbsp;</span>
          </div>
          <button type="submit" disabled={!validate()} className={isWaiting ? "waiting" : ""}>
            {["Login", "Create new account", "Send link to email"][formFlow]}
          </button>
        </div>
        {formFlow !== 1 && !successState ? (
          <div className="login_errorbox">{errorMessage}</div>
        ) : null}
        <button
          type="button"
          className="login_switch"
          onClick={() => {
            if (formFlow === 0) setFormFlow(1);
            else setFormFlow(0);
          }}
        >
          {["Create new account", "I already have an account", "Return to login"][formFlow]}
        </button>
      </form>

      <Modal
        isOpen={Boolean(modalOpen[0])}
        onRequestClose={() => setModalOpen([false, false, ""])}
        className="login_react_modal"
      >
        <div className="login_flex login_form login_modal">
          <div className="login_flex nomargin">
            {!modalOpen[1] ? <div>&nbsp;</div> : <h3>Error</h3>}
            <button
              type="button"
              className="login_button_unstyled"
              onClick={() => setModalOpen([false, false, ""])}
            >
              <img src="/img/close-modal.svg" alt="Close modal" />
            </button>
          </div>
          <div className="login_modal_content">{modalOpen[2]}</div>
          <button
            type="button"
            className="maw-ui_button primary"
            onClick={() => setModalOpen([false, false, ""])}
          >
            Okay
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default LoginPage;
