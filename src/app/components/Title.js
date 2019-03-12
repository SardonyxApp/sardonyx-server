/**
 * @fileoverview Component that renders the title of the tasklist.
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';

class Title extends React.Component {
  render() {
    return (
      <div>
        <h1 id="title">{this.props.title}</h1>
      </div>
    );
  }
}

export default Title;