/**
 * @fileoverview Component to render the tasklist view.
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';
import TasksContainer from './components/TasksContainer';
import TasksFilter from './components/TasksFilter';

class TaskList extends React.Component {
  constructor(props) {
    super(props);

    // Initial filters (set later when users get their default filters)
    this.state = {
      subjectsFilter: [],
      categoriesFilter: []
      // store ids of filtered labels 
    };
    
    this.handleAddFilter = this.handleAddFilter.bind(this);
    this.handleRemoveFilter = this.handleRemoveFilter.bind(this);
  }

  handleAddFilter(type, id) {
    if (type === 'subjects') {
      this.setState({
        subjectsFilter: this.state.subjectsFilter.concat([id])
      });
    } else if (type === 'categories') {
      this.setState({
        categoriesFilter: this.state.categoriesFilter.concat([id])
      });
    }
  }

  handleRemoveFilter(type, id) {
    if (type === 'subjects') {
      this.setState({
        subjectsFilter: this.state.subjectsFilter.filter(l => l !== id) 
      });
    } else if (type === 'categories') {
      this.setState({
        categoriesFilter: this.state.categoriesFilter.filter(l => l !== id)
      });
    }
  }

  render() {
    return (
      <div id="tasklist" className="left-view">
        <TasksFilter 
          subjectsFilter={this.state.subjectsFilter}
          categoriesFilter={this.state.categoriesFilter}
          subjects={this.props.subjects}
          categories={this.props.categories}
          onAddFilter={this.handleAddFilter}
          onRemoveFilter={this.handleRemoveFilter}
        />
        <TasksContainer
          tasks={this.props.tasks}
          subjectsFilter={this.state.subjectsFilter}
          categoriesFilter={this.state.categoriesFilter}
          currentTask={this.props.currentTask}
          onSelectTask={this.props.onSelectTask}
        />
      </div>
    );
  }
}

export default TaskList;