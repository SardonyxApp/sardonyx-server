import React from 'react';
import { DeleteIcon } from '../../logos';

class TaskDelete extends React.Component {
  constructor(props) {
    super(props);

    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete() {
    if (window.confirm('Once deleted, the task cannot be restored. Are you sure?')) {
      this.props.onDeleteTask(this.props.task.id);
    }
  }

  render() {
    return (
      <div id="task-delete" className="taskinfo-component">
        <DeleteIcon 
          style={{ fill: '#f44138', cursor: 'pointer' }}
          onClick={this.handleDelete}
        />
        <p 
          style={{ color: '#f44138', cursor: 'pointer', flex: '0 0 auto', width: 'auto' }}
          onClick={this.handleDelete}
        >
          Delete task
        </p>
      </div>
    );
  }
}

export default TaskDelete;