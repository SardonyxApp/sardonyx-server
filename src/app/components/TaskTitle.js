/**
 * @fileoverview Component for rendering the title of a task in info view.
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';

class TaskTitle extends React.Component {
  render() {
    return (
      <div className="task-title">
        <h2>Title of task</h2>
      </div>
    );
  }
}

export default TaskTitle;