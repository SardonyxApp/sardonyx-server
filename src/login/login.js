import React from 'react';
import ReactDOM from 'react-dom';
import svgs from '../logos.js';
import './login.css';

class LoginForm extends React.Component {
  componentDidMount() {
    // Check for invalid fields
    document.querySelector('input[type="submit"]').addEventListener('click', e => {
      let pass = true;

      const sufficient = (el) => {
        el.style.borderBottom = '2px solid transparent';
      };

      const insufficient = (el) => {
        el.style.borderBottom = '2px solid #ed8a50';
        pass = false;
      };

      const login = document.getElementById('session_login');
      const password = document.getElementById('session_password');
      const agreement = document.getElementById('session_agreement');

      const isEmail = txt => txt.match(/[^@]+@[^@]+\.[^@]+/);
      // Match string with only one "@" and at least one "." after the "@"

      if (login.value === '' || !isEmail(login.value)) insufficient(login);
      else sufficient(login);

      if (password.value === '') insufficient(password);
      else sufficient(password);

      if (agreement.checked === false) {
        insufficient(agreement.parentNode);
      } else sufficient(agreement.parentNode);

      if (!pass) e.preventDefault();
    });
  }

  render() {
    return (
      <form action="/api/login" method="POST" enctype="multipart/form-data" noValidate>
        <label htmlFor="session_login">Login</label>
        <input id="session_login" name="login" type="email" autoFocus/>
        <label htmlFor="session_password">Password</label>
        <input id="session_password" name="password" type="password"/>
        <p><a href="https://kokusaiib.managebac.com/reset-password/new" target="_blank">Forgot password?</a></p>
        <div className="checkbox">
          <input id="session_remember_me" name="remember_me" type="checkbox" value="1"/>
          <label htmlFor="session_remember_me">Remember me. (This is a trusted computer that only I have access to)</label>
        </div>
        <div className="checkbox">
          <input id="session_agreement" type="checkbox" value="1"/>
          <label htmlFor="session_agreement">I have read and agreed to the <a href="">Terms of Service</a> and <a href="">Privacy Policy.</a></label>
        </div>
        <input name="commit" type="submit" value="Sign in" />
      </form>
    );
  }
}

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      invalid: location.search.includes('?invalid=true') ? 'visible' : 'hidden'
    };
    // Show warning message when invalid
  }

  render() {
    return (
      <div id="login">
        <div id="login-box">
          {svgs.icon}
          <h1>Welcome</h1>
          <p>Please use your Kokusai High School ManageBac information to log in to Sardonyx</p>
          <p id="try-again" style={{visibility: this.state.invalid}}>Login failed. Please try again.</p>
          <LoginForm />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Login />, document.getElementById('root'));