/**
 * @fileoverview Component to render task labels in info view.
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';
import { LabelIcon } from '../../logos';

class TaskLabels extends React.Component {
  render() {
    const labels = [];
    if (this.props.task.subject_id) {
      labels.push(
        <div className="label" style={{ background: this.props.task.subject_color}}>{this.props.task.subject_name}</div>
      );
    }
    if (this.props.task.category_id) {
      labels.push(
        <div className="label" style={{ background: this.props.task.category_color}}>{this.props.task.category_name}</div>
      );
    }
    
    return (
      <div class="task-labels">
        <LabelIcon />
        {labels}
      </div>
    );
  }
}

export default TaskLabels; 