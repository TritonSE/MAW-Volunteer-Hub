import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import api_call from "../auth";
import { API_ENDPOINTS } from "../constants/links";
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
  const [isLogin, setIsLogin] = useState(true);
  const [successState, setSuccessState] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rpassword, setRPassword] = useState("");

  const navigate = useNavigate();

  function validate() {
    if (isLogin) return email && password;
    return name && email && password && rpassword && password === rpassword;
  }

  async function handle_submit(e) {
    e.preventDefault();

    if (successState < 1) {
      const res = await api_call(
        isLogin ? API_ENDPOINTS.LOGIN : API_ENDPOINTS.SIGNUP,
        Object.fromEntries(new FormData(e.target).entries())
      );

      if (res === null || res.error) {
        setSuccessState(-1);
        /* Failed -- if signup, email is most likely already in use */
      } else {
        setSuccessState(1);
        if (isLogin) {
          localStorage.setItem("token", res.token);
          navigate("/");
        } else setModalOpen(true);
      }
    }
  }

  useEffect(() => {
    setSuccessState(0);
  }, [email, password]);

  return (
    <div className="login">
      <img alt="Make-a-Wish Logo" src="/img/login_logo.svg" className="login_logo" />
      <form
        className="login_box"
        action={isLogin ? API_ENDPOINTS.LOGIN : API_ENDPOINTS.SIGNUP}
        onSubmit={handle_submit}
        method="POST"
      >
        <div className="login_form">
          <input
            name="name"
            placeholder="Full Name"
            className={isLogin ? "hidden" : ""}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            name="email"
            placeholder="Email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <PasswordField
            name="password"
            className=""
            placeholder="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <PasswordField
            placeholder="Re-enter password"
            type="password"
            className={isLogin ? "hidden" : ""}
            onChange={(e) => setRPassword(e.target.value)}
          />
          <div className={"login_flex" + (isLogin ? "" : " hidden")}>
            <label htmlFor="remember" className="login_flex_center login_pointer">
              <input type="checkbox" id="remember" />
              Keep me signed in
            </label>
            <a href="#forgot">Forgot password</a>
          </div>
          <button type="submit" disabled={!validate()}>
            {isLogin ? "Login" : "Create new account"}
          </button>
        </div>
        {isLogin && successState === -1 ? (
          <div className="login_errorbox">
            {/*
             * Security-wise, it's generally a
             *   good idea to not tell the user
             *   what specifically about the
             *   login went wrong.
             */}
            Invalid email or password.
          </div>
        ) : null}
        <button type="button" className="login_switch" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Create new account" : "I already have an account"}
        </button>
      </form>

      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        style={{
          content: {
            width: "462px",
            height: "202px",
            borderRadius: "10px",
            boxSizing: "border-box",
          },
        }}
      >
        <div className="login_flex login_form login_modal">
          <div className="login_flex nomargin">
            <div>&nbsp;</div>
            <button
              type="button"
              className="login_button_unstyled"
              onClick={() => setModalOpen(false)}
            >
              <img src="/close-modal.svg" alt="Close modal" />
            </button>
          </div>
          <div className="login_modal_content">
            Your account has been created! Once an admin confirms, you will be notified via email
            and be able to access the website.
          </div>
          <button type="button" className="login_button_round" onClick={() => setModalOpen(false)}>
            Okay
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default LoginPage;
