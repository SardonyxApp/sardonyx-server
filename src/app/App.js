/**
 * @fileoverview Front end app for Sardonyx tasklists.
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';
import ReactDOM from 'react-dom';
import './app.scss';

import TopBar from './TopBar';
import ContentWindow from './ContentWindow';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: { // hard coded for now 
        teacher: false,
        name: 'John Doe', 
        email: 'johndoe@example.com'
      },
      tasklist: {
        name: 'Temporary title',
        description: 'Test tasklist'
      }
    };
  }

  render() {
    return (
      <div>
        <TopBar 
          user={this.state.user}
          tasklist={this.state.tasklist} 
        />
        <ContentWindow />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));