/**
 * @fileoverview Component to render the detailed view for a task.
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';
import TaskTitle from './components/TaskTitle';
import TaskLabels from './components/TaskLabels';
import TaskDescription from './components/TaskDescription';
import TaskDue from './components/TaskDue';
import TaskAuthor from './components/TaskAuthor';

class TaskInfo extends React.Component {
  render() {
    return this.props.task ? (
      <div id="taskinfo" className="right-view">
        <div className="card custom-scroll">
          <TaskTitle 
            title={this.props.task.name}
            onChangeTask={this.props.onChangeTask}
          />
          <TaskLabels 
            task={this.props.task}
            onModal={this.props.onModal}
          />
          <TaskDescription
            description={this.props.task.description}
            onChangeTask={this.props.onChangeTask}
          />
          <TaskDue 
            due={this.props.task.due}
            onModal={this.props.onModal}
            onChangeTask={this.props.onChangeTask}
          />
          <TaskAuthor 
            author={this.props.task.student_name || this.props.task.teacher_name}
          />
        </div>
      </div>
    ) : (
      <div id="taskinfo" className="right-view">
        <h3 style={{ textAlign: 'center' }}>Please select a task to see in detail.</h3>
      </div>      
    );
  }
}

export default TaskInfo;