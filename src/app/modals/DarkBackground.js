/**
 * @fileoverview Render the dark background when a modal is open.
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';

class DarkBackground extends React.Component {
  render() {
    return this.props.modal !== null ? <div id="dark-background" onClick={() => this.props.onModal(null)}></div> : null;
  }
}

export default DarkBackground;