import React, { useState } from "react";
import "../index.css";
import "../css/LoginPage.css";

function PasswordField({ placeholder, className, onChange }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={className + " login_password"}>
      <input placeholder={placeholder} type={isVisible ? "text" : "password"} onChange={onChange} />
      <img
        alt="Toggle password visibility"
        src={isVisible ? "/img/login_visible.svg" : "/img/login_notvisible.svg"}
        className={"login_password_eye" + (isVisible ? " visible" : "")}
        onClick={() => setIsVisible(!isVisible)}
      />
    </div>
  );
}

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rpassword, setRPassword] = useState("");

  function validate() {
    return name && email && password && rpassword && password === rpassword;
  }

  return (
    <div className="login">
      <img alt="Make-a-Wish Logo" src="/img/login_logo.svg" className="login_logo" />
      <form className="login_box" action="/">
        <div className="login_form">
          <input
            placeholder="Full Name"
            className={isLogin ? "hidden" : ""}
            onChange={(e) => setName(e.target.value)}
          />
          <input placeholder="Email" type="email" onChange={(e) => setEmail(e.target.value)} />
          <PasswordField
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
            <div className="login_flex_center">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Keep me signed in</label>
            </div>
            <a href="#forgot">Forgot password</a>
          </div>
          <button type="submit" disabled={!isLogin && !validate()}>
            {isLogin ? "Login" : "Create new account"}
          </button>
        </div>
        <button type="button" className="login_switch" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Create new account" : "I already have an account"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
