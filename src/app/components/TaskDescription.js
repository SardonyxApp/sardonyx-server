/**
 * @fileoverview Component to render the description for a task in info view. 
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';
import { DescriptionIcon } from '../../logos';

class TaskDescription extends React.Component {
  render() {
    return (
      <div id="task-description" className="taskinfo-component">
        <DescriptionIcon />
        <p>{this.props.description || 'No description provided.'}</p>
      </div>
    );
  }
}

export default TaskDescription;