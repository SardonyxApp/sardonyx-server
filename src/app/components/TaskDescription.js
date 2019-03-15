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
        {this.props.description}
      </div>
    );
  }
}

export default TaskDescription;