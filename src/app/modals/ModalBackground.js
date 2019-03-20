/**
 * @fileoverview Render the dark background when a modal is open.
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';

class ModalBackground extends React.Component {
  render() {
    let styles = {
      background: 'rgba(0, 0, 0, 0.3'
    };

    if (this.props.modal === 'profile' || this.props.modal === 'tasklists') {
      styles.background = 'transparent';
    }

    return this.props.modal !== null ? <div className="modal-background" style={styles} onClick={() => this.props.onModal(null)}></div> : null;
  }
}

export default ModalBackground;