import React from 'react';
import ReactDOM from 'react-dom';
import './app.scss';

class App extends React.Component {
  render() {
    return <div>This is the web app.</div>;
  }
}

ReactDOM.render(<App />, document.getElementById('root'));