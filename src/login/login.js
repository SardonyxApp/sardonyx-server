import React from 'react';
import ReactDOM from 'react-dom';
import { Icon } from '../logos.js';
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

      const isEmail = txt => txt.match(/[^@]+@[^@]+\.[^@]+/);
      // Match string with only one "@" and at least one "." after the "@"

      if (login.value === '' || !isEmail(login.value)) insufficient(login);
      else sufficient(login);

      if (password.value === '') insufficient(password);
      else sufficient(password);

      if (!pass) {
        e.preventDefault();
        this.props.onValidationError();
      }
    });
  }

  render() {
    return (
      <form action={'/login'} method="POST" enctype="multipart/form-data" noValidate>
        <label htmlFor="session_login">Login</label>
        <input id="session_login" name="login" type="email" autoFocus/>
        <label htmlFor="session_password">Password</label>
        <input id="session_password" name="password" type="password"/>
        <p id="forgot-password"><a href="https://kokusaiib.managebac.com/reset-password/new" target="_blank">Forgot password?</a></p>
        <p>By accessing Sardonyx, you agree to our <a href="../terms" target="_blank">Terms of Service</a> and <a href="../privacy" target="_blank">Privacy Policy</a>. You also agree to the use of necessary cookies to run this application.</p>
        <input name="commit" type="submit" value="Sign in" />
      </form>
    );
  }
}

class Login extends React.Component {
  constructor() {
    super();
    let flash = null;
    if (location.search.includes('invalid=true')) flash = 'Login failed. Please try again.';
    if (location.search.includes('logout=true')) flash = 'You have been logged out.'; 
    if (location.search.includes('password=true')) flash = 'Password changed successfully.'; 
    
    this.state = { flash };

    this.handleValidationError = this.handleValidationError.bind(this);
  }

  handleValidationError() {
    this.setState({
      flash: 'Please enter a valid email and password.'
    });
  }

  render() {
    return (
      <div id="login" className="root">
        <div id="login-box" className="container">
          <div style={{ cursor: 'pointer', display: 'inline-block' }} onClick={() => window.location.replace('/?redirect=false')}>
            <Icon />
          </div>
          <h1>Welcome</h1>
          <p>Login to Sardonyx</p>
          <p id="try-again">{this.state.flash}</p>
          <LoginForm 
            onValidationError={this.handleValidationError} 
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Login />, document.getElementById('root'));