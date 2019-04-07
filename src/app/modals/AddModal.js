/**
 * @fileoverview Component to render the menu modal for adding new items.
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';
import { NextIcon } from '../../logos';
import { TwitterPicker } from 'react-color';

class AddModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Generate random hex color 
      color: "#000000".replace(/0/g, () => Math.floor(Math.random() * 16).toString(16)),
      errorMessage: null
    };

    this.inputRef = React.createRef();
    
    this.handleAddTask = this.handleAddTask.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.modal !== this.props.modal) {
      this.setState({
        color: "#000000".replace(/0/g, () => Math.floor(Math.random() * 16).toString(16)),
        errorMessage: null
      });
    }
  }

  handleAddTask() {
    const name = this.inputRef.current.value;
    if (!name || name.length > 255) return this.handleError(this.inputRef.current);

    this.props.onCreateTask({ name });
    this.props.onModal();
  }

  handleAddLabel(type) {
    const name = this.inputRef.current.value;
    if (!name || name.length > 255) return this.handleError(this.inputRef.current);

    this.props.onCreateLabel(type === 'subject' ? 'subjects' : 'categories', { name, color: this.state.color })
    this.props.onModal();
  }

  handleColor(color) {
    this.setState({ color });
  }

  handleError(el) {
    el.style.borderBottom = '2px solid #f44138';
    el.focus();

    this.setState({ 
      errorMessage: el.value ? 'Name has to be shorter than 255 characters.' : 'Name cannot be empty.'
    });
  }

  render() {
    const position = () => {
      if (this.props.modal.y > document.documentElement.clientHeight / 2) {
        return {
          left: this.props.modal.x,
          bottom: document.documentElement.clientHeight - this.props.modal.y
        };
      }

      return {
        right: document.documentElement.clientWidth - this.props.modal.x,
        top: this.props.modal.y
      };
    };

    // Render the default add options 
    if (this.props.modal.name === 'add') {
      return (
        <div id="add-modal" className="modal" style={{ ...position() }}>
          <ul>
            <li onClick={() => this.props.onModal('add-task', this.props.modal.x, this.props.modal.y)}>Add task</li>
            <li onClick={() => this.props.onModal('add-subject', this.props.modal.x, this.props.modal.y)}>Add subject label</li>
            <li onClick={() => this.props.onModal('add-category', this.props.modal.x, this.props.modal.y)}>Add category label</li>
          </ul>
        </div>
      );
    }

    // Render interface to enter title of new task
    if (this.props.modal.name === 'add-task') {
      return (
        <div id="add-task-modal" className="modal" style={{ ...position() }}>
          <div>
            <input 
              id="add-task-input" 
              className="name-input"
              type="text" 
              style={{ width: '200px' }}
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

          <p className="error-message" style={{ textAlign: 'right' }}>{this.state.errorMessage}</p>
        </div>
      );
    }

    if (this.props.modal.name === 'add-subject' || this.props.modal.name === 'add-category') {
      const type = this.props.modal.name === 'add-subject' ? 'subject' : 'category';
      return (
        <div id={`add-${type}-modal`} className="modal" style={{ ...position(), zIndex: this.props.zIndex }}>
          <div>
            <input
              id={`add-${type}-input`}
              className="name-input"
              type="text"
              style={{ width: '236px' }}
              placeholder={`Enter the name of the ${type}`}
              autoFocus
              onKeyDown={e => {
                if (e.keyCode === 13) this.handleAddLabel(type);
                if (e.keyCode === 27) this.props.onModal();
              }}
              ref={this.inputRef}
            />
            <NextIcon 
              width={16}
              height={16}
              style={{ cursor: 'pointer' }}
              onClick={() => this.handleAddLabel(type)}
            />
          </div>

          <p className="error-message" style={{ textAlign: 'right' }}>{this.state.errorMessage}</p>

          <TwitterPicker 
            color={this.state.color}
            onChangeComplete={color => this.handleColor(color.hex)}
            width={252}
            triangle="hide"
          />

          <div>
            <p style={{ display: 'inline-block' }}>Use color</p>
            <div className="dot" style={{ background: this.state.color, marginLeft: '4px' }}></div>
          </div>
        </div>
      )
    }

    return null;
  }
}

export default AddModal;