/**
 * @fileoverview Component to render the menu modal for adding new items.
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';
import { NextIcon } from '../../logos';

class AddModal extends React.Component {
  constructor(props) {
    super(props);

    this.inputRef = React.createRef();
    
    this.handleAddTask = this.handleAddTask.bind(this);
  }

  handleAddTask() {
    const name = this.inputRef.current.value;
    if (!name.length) {
      this.inputRef.current.style.borderBottom = '2px solid #f44138';
      this.inputRef.current.focus();
      return;
    }

    this.props.onNewTask({ name });
    this.props.onModal();
  }

  render() {
    // Render the default add options 
    if (this.props.modal.name === 'add-modal') {
      return (
        <div id="add-modal" className="modal" style={{ right: this.props.modal.x, top: this.props.modal.y }}>
          <ul>
            <li onClick={() => this.props.onModal('add-task-modal', this.props.modal.x, this.props.modal.y)}>Add task</li>
            <li>Add subject label</li>
            <li>Add category label</li>
          </ul>
        </div>
      );
    }

    // Render interface to enter title of new task
    if (this.props.modal.name === 'add-task-modal') {
      return (
        <div id="add-task-modal" className="modal" style={{ right: this.props.modal.x, top: this.props.modal.y }}>
          <input 
            id="add-task-input" 
            type="text" 
            placeholder="Enter the name of the task"
            autoFocus
            onKeyDown={e => {
              if (e.keyCode === 13) this.handleAddTask();
              if (e.keyCode === 27) this.props.onModal();
            }}
            ref={this.inputRef}
          />
          <NextIcon 
            width={16}
            height={16}
            style={{ cursor: 'pointer' }}
            onClick={this.handleAddTask}
          />
        </div>
      );
    }

    return null;
  }
}

export default AddModal;