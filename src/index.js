import React from 'react';
import ReactDOM from 'react-dom';
import { Icon } from './logos.js';
import './index.scss';

class Root extends React.Component {
  render() {
    return (
      <div>
        <h1>Sardonyx</h1>
        <Icon width={300} height={300} />
        <p>The web app is under development.</p>
        <p>Source code is on <a href="https://github.com/SardonyxApp">Github</a>.</p>
        <a href="login">Student Login</a> | <a href="login?teacher=true">Teacher Login</a>
      </div>
    );
  }
}

ReactDOM.render(<Root />, document.getElementById('root'));