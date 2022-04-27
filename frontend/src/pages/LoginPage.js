import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { api_login, api_signup } from "../api";
import { SITE_PAGES } from "../constants/links";
import { CurrentUser } from "../components/Contexts";
import "../styles/LoginPage.css";

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

  const [isLogin, setIsLogin] = useState(true);
  const [successState, setSuccessState] = useState(-1);
  const [modalOpen, setModalOpen] = useState(false);
  const [doRemember, setDoRemember] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rpassword, setRPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  function validate(is_submit = false) {
    // This is a very simple regex to avoid performance degradation
    //   on longer strings -- More complex validation is done server-
    //   side.
    const email_regex = /\S+@\S+\.\S+/;

    if (!is_submit) {
      if (isLogin) return email_regex.test(email) && password;
      return name && email_regex.test(email) && password && rpassword && password === rpassword;
    }

    let errors_obj = {
      email: !email_regex.test(email),
      password: !password.trim(),
    };

    if (!isLogin) {
      errors_obj = {
        name: !name.trim(),
        ...errors_obj,
        rpassword: !rpassword.trim() || password !== rpassword,
      };
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
      const res = await (isLogin ? api_login(formdata) : api_signup(formdata));
      const success = Boolean(res && res.success);
      setIsWaiting(false);

      if (isLogin) {
        setSuccessState(success);

        if (res.user) {
          setCurrentUser(res.user);
          window.scrollTo(0, 0);
          navigate(SITE_PAGES.HOME);
        } else {
          setErrorMessage(res.error);
        }
      } else {
        // TODO: This lets the user log in immediately
        //   after signing up, for debug purposes
        setSuccessState(-1);

        // api.js guarantees that res will have an error object on failure
        setModalOpen(success ? true : res.error);
      }
    }
  }

  useEffect(() => setSuccessState(-1), [email, password]);

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
              ${isLogin ? "hidden" : ""}
              ${errors.name ? "error" : ""}
            `}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            name="email"
            placeholder="Email"
            type="email"
            className={`
              ${errors.email ? "error" : ""}
            `}
            onChange={(e) => setEmail(e.target.value)}
          />
          <PasswordField
            name="password"
            className={`
              ${errors.password ? "error" : ""}
            `}
            placeholder="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <PasswordField
            className={`
              ${isLogin ? "hidden" : ""}
              ${errors.rpassword ? "error" : ""}
            `}
            placeholder="Re-enter password"
            type="password"
            onChange={(e) => setRPassword(e.target.value)}
          />
          <div className={"login_flex" + (isLogin ? "" : " hidden")}>
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
            {/* <a href="#forgot">Forgot password</a> */}
            <span>&nbsp;</span>
          </div>
          <button
            type="submit"
            disabled={!validate()}
            className={`maw-ui_button ${isWaiting ? "waiting" : ""}`}
          >
            {isLogin ? "Login" : "Create new account"}
          </button>
        </div>
        {isLogin && !successState ? <div className="login_errorbox">{errorMessage}</div> : null}
        <button type="button" className="login_switch" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Create new account" : "I already have an account"}
        </button>
      </form>

      <Modal
        isOpen={Boolean(modalOpen)}
        onRequestClose={() => setModalOpen(false)}
        className="thin flex"
      >
        <div className="login_flex login_form login_modal nomargin">
          <div className="login_flex nomargin">
            {modalOpen === true ? <div>&nbsp;</div> : <h3>Error</h3>}
            <button
              type="button"
              className="login_button_unstyled"
              onClick={() => setModalOpen(false)}
            >
              <img src="/img/close-modal.svg" alt="Close modal" />
            </button>
          </div>
          <div className="login_modal_content">
            {modalOpen === true
              ? "Your account has been created! Once an admin confirms, you will be notified via email and be able to access the website."
              : modalOpen}
          </div>
          <button
            type="button"
            className="maw-ui_button primary"
            onClick={() => setModalOpen(false)}
          >
            Okay
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default LoginPage;
