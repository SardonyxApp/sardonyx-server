import React from 'react';
import TasksContainer from './components/TasksContainer';
import TasksFilter from './components/TasksFilter';

class TaskList extends React.Component {
  render() {
    return (
      <div id="tasklist" className="left-view">
        <TasksFilter 
          subjects={this.props.subjects}
          categories={this.props.categories}
          subjectsFilter={this.props.subjectsFilter}
          categoriesFilter={this.props.categoriesFilter}
          onModal={this.props.onModal}
          onFilter={this.props.onFilter}

        />
        <TasksContainer
          tasks={this.props.tasks}
          subjectsFilter={this.props.subjectsFilter}
          categoriesFilter={this.props.categoriesFilter}
          displayPastTasks={this.props.displayPastTasks}
          currentTask={this.props.currentTask}
          onSelectTask={this.props.onSelectTask}
          onLoadAllTasks={this.props.onLoadAllTasks}
        />
      </div>
    );
  }
}

export default TaskList;