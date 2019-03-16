/**
 * @fileoverview Component for rendering the title of a task in info view.
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';

class TaskTitle extends React.Component {
  render() {
    return (
      <div id="task-title">
        <h2>{this.props.title}</h2>
      </div>
    );
  }
}

export default TaskTitle;