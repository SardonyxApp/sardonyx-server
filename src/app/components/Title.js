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
        <h1 id="title" onClick={() => this.props.onModal('tasklists', '50%', 50)}>{this.props.title}</h1>
      </div>
    );
  }
}

export default Title;