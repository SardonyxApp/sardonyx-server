import React from 'react';
import { NextIcon } from '../../logos';

class AddTaskModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMessage: null
    };

    this.nameRef = React.createRef();
    
    this.handleAddTask = this.handleAddTask.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.modal !== this.props.modal) {
      this.setState({
        errorMessage: null
      });
    }
  }

  handleAddTask() {
    const name = this.nameRef.current.value;
    if (!name || name.length > 255) return this.handleError(this.nameRef.current);

    this.props.onCreateTask({ name });
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
    // Render interface to enter title of new task
    return (
      <div id="add-task-modal" className="modal" style={{ right: document.documentElement.clientWidth - this.props.modal.x, top: this.props.modal.y }}>
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
            ref={this.nameRef}
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
}

export default AddTaskModal;