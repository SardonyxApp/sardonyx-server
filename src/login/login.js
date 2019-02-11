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
      <form action={this.props.teacher ? '/login/teacher' : '/login/student'} method="POST" enctype="multipart/form-data" noValidate>
        <label htmlFor="session_login">Login</label>
        <input id="session_login" name="login" type="email" autoFocus/>
        <label htmlFor="session_password">Password</label>
        <input id="session_password" name="password" type="password"/>
        <p id="forgot-password"><a href="https://kokusaiib.managebac.com/reset-password/new" target="_blank">Forgot password?</a></p>
        <p>Sardonyx is not affiliated, associated, authorized, endorsed by, or in any way officially connected with ManageBac, or any of its subsidiaries or its affiliates.</p>
        <p>By accessing Sardonyx, you agree to our <a href="">Terms of Service</a> and <a href="">Privacy Policy</a>.</p>
        <p><a href="" onClick={e => this.props.onSwitchLogin(e)}>Click here to access the {this.props.teacher ? 'student' : 'teacher'} login.</a></p>
        <input name="commit" type="submit" value="Sign in" />
      </form>
    );
  }
}

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      errorMessage: location.search.includes('invalid=true') ? 'Login failed. Please try again.' : null,
      teacher: location.search.includes('teacher=true')
    };

    this.handleValidationError = this.handleValidationError.bind(this);
    this.handleSwitchLogin = this.handleSwitchLogin.bind(this);
  }

  handleValidationError() {
    this.setState({
      errorMessage: 'Please enter a valid email and password.'
    });
  }
  
  handleSwitchLogin(e) {
    this.setState({
      teacher: !this.state.teacher
    });
    e.preventDefault();
  }

  render() {
    return (
      <div id="login">
        <div id="login-box">
          {svgs.icon}
          <h1>Welcome</h1>
          <p style={{ display: !this.state.teacher ? 'block' : 'none' }}>Please use your Kokusai High School ManageBac information to log in to Sardonyx.</p>
          <p style={{ display: this.state.teacher ? 'block' : 'none' }}>Please login to Sardonyx (for teachers).</p>
          <p id="try-again">{this.state.errorMessage}</p>
          <LoginForm 
            onValidationError={this.handleValidationError} 
            onSwitchLogin={this.handleSwitchLogin}
            teacher={this.state.teacher}
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Login />, document.getElementById('root'));