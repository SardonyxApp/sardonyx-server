/**
 * @fileoverview Render the dark background when a modal is open.
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';

class ModalBackground extends React.Component {
  render() {
    const background = ['settings'].includes(this.props.modal.name) ? 'rgba(0, 0, 0, 0.3)' : 'transparent'
    return this.props.modal.name !== null ? <div className="modal-background" style={{ background, zIndex: this.props.zIndex }} onClick={() => this.props.onModal()}></div> : null;
  }
}

export default ModalBackground;