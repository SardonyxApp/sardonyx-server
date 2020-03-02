import React from 'react';
import TaskTitle from './components/TaskTitle';
import TaskLabels from './components/TaskLabels';
import TaskDescription from './components/TaskDescription';
import TaskDue from './components/TaskDue';
import TaskAuthor from './components/TaskAuthor';
import TaskDelete from './components/TaskDelete';

class TaskInfo extends React.Component {
  render() {
    return this.props.task ? (
      <div id="taskinfo" className="right-view">
        <div className="card">
          <TaskTitle 
            id={this.props.task.id}
            title={this.props.task.name}
            onUpdateTask={this.props.onUpdateTask}
          />
          <div id="task-detail-container" className="custom-scroll">
            <TaskLabels 
              task={this.props.task}
              onModal={this.props.onModal}
            />
            <TaskDescription
              id={this.props.task.id}
              description={this.props.task.description}
              onUpdateTask={this.props.onUpdateTask}
            />
            <TaskDue 
              id={this.props.task.id}
              due={this.props.task.due}
              onModal={this.props.onModal}
              onUpdateTask={this.props.onUpdateTask}
            />
            <TaskAuthor 
              author={this.props.task.user_name}
            />
            <TaskDelete 
              task={this.props.task}
              onDeleteTask={this.props.onDeleteTask}
            />
          </div>
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