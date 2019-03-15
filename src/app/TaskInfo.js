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
    return this.props.task ? (
      <div id="taskinfo" className="right-view">
        <div className="card">
          <TaskTitle 
            title={this.props.task.name}
          />
          <TaskDescription
            description={this.props.task.description}
          />
        </div>
      </div>
    ) : (
      <div id="taskinfo" className="right-view">
        <h3 style={{ lineHeight: '100%', textAlign: 'center' }}>Please select a task to see in detail.</h3>
      </div>      
    );
  }
}

export default TaskInfo;