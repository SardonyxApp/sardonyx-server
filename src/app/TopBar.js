import React from 'react';
import './app.scss';

import Sardonyx from './components/Sardonyx';
import Title from './components/Title';
import User from './components/User';

class TopBar extends React.Component {
  render() {
    return (
      <div id="top-bar" className="bar">
        <Sardonyx />
        <Title title={this.props.tasklist ? this.props.tasklist.name : null} onModal={this.props.onModal} /> 
        <User user={this.props.user} onModal={this.props.onModal} />
      </div>
    );
  }
}

export default TopBar;