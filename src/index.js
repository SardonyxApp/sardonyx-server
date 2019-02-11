import React from 'react';
import ReactDOM from 'react-dom';
import svgs from './logos.js';
import './index.scss';

class Root extends React.Component {
  render() {
    return (
      <div>
        <h1>Sardonyx</h1>
        {svgs.icon}
        <p>The web app is under development.</p>
        <p>Source code is on <a href="https://github.com/SardonyxApp">Github</a>.</p>
        <a href="login">Login</a>
      </div>
    );
  }
}

ReactDOM.render(<Root />, document.getElementById('root'));