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
      <div className="task-description">
        <DescriptionIcon />
        <p>{this.props.description}</p>
      </div>
    );
  }
}

export default TaskDescription;