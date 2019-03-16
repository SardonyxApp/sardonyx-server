/**
 * @fileoverview Component to render the author of a task in info view. 
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';
import { UserIcon } from '../../logos';

class TaskAuthor extends React.Component {
  render() {
    return (
      <div 
        id="task-author" 
        className="taskinfo-component" 
        style={{ display: !!this.props.author ? '' : 'none' }}
      >
        <UserIcon />
        <p>Added by {this.props.author}</p>
      </div>
    );
  }
}

export default TaskAuthor; 