/**
 * @fileoverview Component to render the menu modal for adding new items.
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';

class AddModal extends React.Component {
  render() {
    return this.props.modal.name === 'add-modal' ? (
      <div id="add-modal" className="modal" style={{ right: this.props.modal.x, top: this.props.modal.y }}>
        <ul>
          <li>Add task</li>
          <li>Add subject label</li>
          <li>Add category label</li>
        </ul>
      </div>
    ) : null;
  }
}

export default AddModal;