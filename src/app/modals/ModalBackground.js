/**
 * @fileoverview Render the dark background when a modal is open.
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';

class ModalBackground extends React.Component {
  render() {
    return this.props.modal.name !== null ? <div className="modal-background" style={{ background: 'transparent' }} onClick={() => this.props.onModal()}></div> : null;
  }
}

export default ModalBackground;