/**
 * @fileoverview Component to render the tasklist view.
 * @author SardonyxApp
 * @license MIT 
 */

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
          onAddFilter={this.props.onAddFilter}
          onRemoveFilter={this.props.onRemoveFilter}

        />
        <TasksContainer
          tasks={this.props.tasks}
          subjectsFilter={this.props.subjectsFilter}
          categoriesFilter={this.props.categoriesFilter}
          currentTask={this.props.currentTask}
          onSelectTask={this.props.onSelectTask}
        />
      </div>
    );
  }
}

export default TaskList;