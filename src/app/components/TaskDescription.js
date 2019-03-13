/**
 * @fileoverview Component to render the description for a task in info view. 
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';

class TaskDescription extends React.Component {
  render() {
    return (
      <div className="task-description">
        This is a description for the task. (Hard coded for now.)
      </div>
    );
  }
}

export default TaskDescription;