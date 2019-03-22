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
        <div className="label" style={{ background: this.props.task.subject_color}}>
          <p>{this.props.task.subject_name}</p>
        </div>
      );
    }
    if (this.props.task.category_id) {
      labels.push(
        <div className="label" style={{ background: this.props.task.category_color}}>
          <p>{this.props.task.category_name}</p>
        </div>
      );
    }
    
    return (
      <div id="task-labels" className="taskinfo-component" onClick={() => this.props.onModal('labels')}>
        <LabelIcon />
        {!!labels.length ? labels : <p>No labels set.</p>}
      </div>
    );
  }
}

export default TaskLabels; 