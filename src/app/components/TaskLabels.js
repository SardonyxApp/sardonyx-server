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
        <div 
          className="label" 
          style={{ background: this.props.task.subject_color, cursor: 'pointer' }}
          onClick={e => {
            // If target is <p>, use coordinates of parent .label
            const position = e.target.nodeName === 'DIV' ? e.target.getBoundingClientRect() : e.target.parentNode.getBoundingClientRect();
            return this.props.onModal(this.props.task.category_id ? 'subjects' : 'labels', position.left, position.bottom + 8);
          }}
        >
          <p>{this.props.task.subject_name}</p>
        </div>
      );
    }
    if (this.props.task.category_id) {
      labels.push(
        <div 
          className="label" 
          style={{ background: this.props.task.category_color, cursor: 'pointer' }}
          onClick={e => {
            // If target is <p>, use coordinates of parent .label
            const position = e.target.nodeName === 'DIV' ? e.target.getBoundingClientRect() : e.target.parentNode.getBoundingClientRect();
            return this.props.onModal(this.props.task.subject_id ? 'categories' : 'labels', position.left, position.bottom + 8);
          }}
        >
          <p>{this.props.task.category_name}</p>
        </div>
      );
    }
    
    return (
      <div id="task-labels" className="taskinfo-component">
        <LabelIcon />
        {!!labels.length 
          ? labels 
          : <p 
            style={{ cursor: 'pointer' }}
            onClick={e => {
              const position = e.target.getBoundingClientRect();
              return this.props.onModal('labels', position.left, position.bottom + 8);
            }}
          >
            No labels set.
          </p>
        }
      </div>
    );
  }
}

export default TaskLabels; 