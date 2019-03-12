/**
 * @fileoverview Component to render the menu bar at the top.
 * @author SardonyxApp
 * @license MIT 
 */

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
        <Title title={this.props.tasklist.name} />
        <User user={this.props.user} />
      </div>
    );
  }
}

export default TopBar;