/**
 * @fileoverview Component to render the tasklist view.
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';
import TaskContainer from './components/TaskContainer';
import TaskFilter from './components/TaskFilter';

class TaskList extends React.Component {
  constructor(props) {
    super(props);

    // Initial filters (set later when users get their default filters)
    this.state = {
      filter: []
    };
    
    this.handleAddFilter = this.handleAddFilter.bind(this);
    this.handleRemoveFilter = this.handleRemoveFilter.bind(this);
  }

  handleAddFilter(id) {
    this.setState({
      filter: this.state.filter.concat([id])
    });
  }

  handleRemoveFilter(id) {
    this.setState({
      filter: this.state.filter.filter(label => label.id !== id)
    });
  }

  render() {
    return (
      <div id="tasklist" className="left-view">
        <TaskFilter />
        <TaskContainer
          tasks={this.props.tasks}
          currentTask={this.props.currentTask}
          onSelectTask={this.props.onSelectTask}
        />
      </div>
    );
  }
}

export default TaskList;