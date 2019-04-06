/**
 * @fileoverview Page to change password for teachers.
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Icon } from '../logos';
import './login.css';

class ChangePassword extends React.Component {
  constructor() {
    super();
    this.state = {
      errorMessage: null
    };
  }

  componentDidMount() {
    // Check for invalid fields
    document.querySelector('input[type="submit"]').addEventListener('click', e => {
      let state = 'pass'; 

      const sufficient = (el) => {
        el.style.borderBottom = '2px solid transparent';
      };

      const insufficient = (el, reason) => {
        el.style.borderBottom = '2px solid #ed8a50';
        state = reason;
      };

      const password = [document.getElementById('new_password'), document.getElementById('confirm_password')];

      if (!password[0].value) insufficient(password[0], 'empty');
      else sufficient(password[0]);

      if (!password[1].value) insufficient(password[1], 'empty');
      else sufficient(password[1]);

      if (password[0].value !== password[1].value) {
        insufficient(password[0], 'unequal');
        insufficient(password[1], 'unequal');
      }

      if (state === 'empty') {
        this.setState({
          errorMessage: 'Please complete all fields.'
        });
        e.preventDefault();
      }

      if (state === 'unequal') {
        this.setState({
          errorMessage: 'The passwords do not match.'
        });
        e.preventDefault();
      }
    });
  }

  render() {
    return (
      <div id="change-password" className="root">
        <div className="container">
          <Icon />
          <h1>Change Password</h1>
          <p>You can change the password for your teacher account using this form.</p>
          <p id="try-again">{this.state.errorMessage}</p>
          <form action="/password" method="post" encType="multipart/form-data" noValidate>
            <label>New Password</label>
            <input id="new_password" type="password" name="new_password" />
            <label>Confirm Password</label>
            <input id="confirm_password" type="password" name="confirm_password" />
            <input type="submit" value="Change Password" />
          </form>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<ChangePassword />, document.getElementById('root'));