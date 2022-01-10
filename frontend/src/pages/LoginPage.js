import React from 'react';
import { useState } from 'react';
import '../index.css';

function PasswordField({ placeholder, className, onChange }){
  const [isVisible, setIsVisible] = useState(false);

  return (
      <div className={className + ' login_password'}>
        <input placeholder={placeholder} type={isVisible ? 'text' : 'password'} onChange={onChange} />
        <img
          src={isVisible ? '/visible.svg' : '/notvisible.svg'}
          className={'login_password_eye' + (isVisible ? ' visible' : '')}
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
  
  function validate(){
    return (name && email && password && rpassword && (password === rpassword));
  }

  return (
    <div className='login'>
      <img src='/login_logo.svg' className='login_logo' />
      <form className='login_box' action='/'>
        <input placeholder='Full Name' className={isLogin ? 'hidden' : ''} onChange={(e) => setName(e.target.value)}/>
        <input placeholder='Email' type='email' onChange={(e) => setEmail(e.target.value)} />
        <PasswordField
          placeholder='Password'
          type='password'
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <PasswordField 
          placeholder='Re-enter password' 
          type='password' 
          className={isLogin ? 'hidden' : ''} 
          onChange={(e) => setRPassword(e.target.value) }
        />
        <div className={'login_flex' + (isLogin ? '' : ' hidden')}>
          <div className='login_flex_center'>
            <input type='checkbox' id='remember' />
            <label htmlFor='remember'>Keep me signed in</label>
          </div>
          <a href='#'>Forgot password</a>
        </div>
        <button disabled={!isLogin && !validate()}>
          {
            (isLogin ? 'Login' : 'Create new account')
          }
        </button>

        <button type='button' className='login_switch' onClick={() => setIsLogin(!isLogin)}>
          {
            (isLogin ? 'Create new account' : 'I already have an account')
          }
        </button>
      </form>
    </div>
  );
}

export default LoginPage;