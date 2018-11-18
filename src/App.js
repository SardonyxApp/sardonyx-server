import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

class Root extends React.Component {
  render() {
    return (
      <h1>Hello world</h1>
    );
  }
}

ReactDOM.render(<Root />, document.getElementById('root'));