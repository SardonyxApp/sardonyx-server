/**
 * @fileoverview Component to render the detailed view for a task.
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';
import TaskTitle from './components/TaskTitle';
import TaskDescription from './components/TaskDescription';

class TaskInfo extends React.Component {
  render() {
    return (
      <div id="taskinfo" className="right-view">
        <div className="card">
          <TaskTitle />
          <TaskDescription />
        </div>
      </div>
    );
  }
}

export default TaskInfo;