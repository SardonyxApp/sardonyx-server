import React from 'react';
import ReactDOM from 'react-dom';

import './index.scss';

class Root extends React.Component {
  render() {
    return (
      <div>
        <h1>Sardonyx</h1>
        <img src={require('./Icon.svg')} id="logo" />
        <p>The web app is under development.</p>
        <p>Source code is on <a href="https://github.com/SardonyxApp">Github</a>.</p>
      </div>
    );
  }
}

ReactDOM.render(<Root />, document.getElementById('root'));