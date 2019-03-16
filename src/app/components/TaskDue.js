/**
 * @fileoverview Component to render the due date for a task in info view. 
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';
import { TimeIcon } from '../../logos';

class TaskDue extends React.Component {
  render() {
    return (
      <div id="task-due" className="taskinfo-component">
        <TimeIcon />
        <p>Due {!!this.props.due ? new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', day: 'numeric'}).format(new Date(this.props.due)) : 'date not set'}</p>
      </div>
    );
  }
}

export default TaskDue;