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
      <div className="task-due">
        <TimeIcon width={24} height={24} />
        <p>Due {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', day: 'numeric'}).format(new Date(this.props.due))}</p>
      </div>
    );
  }
}

export default TaskDue;