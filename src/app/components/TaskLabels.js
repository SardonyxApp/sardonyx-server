/**
 * @fileoverview Component to render task labels in info view.
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';
import { LabelIcon } from '../../logos';

const Label = props => (
  <div 
    className="label" 
    style={{ background: props.color, cursor: 'pointer' }}
    onClick={e => {
      // If target is <p>, use coordinates of parent .label
      const position = e.target.nodeName === 'DIV' ? e.target.getBoundingClientRect() : e.target.parentNode.getBoundingClientRect();
      return props.onModal(position.left, position.bottom + 8);
    }}
  >
    <p>{props.name}</p>
  </div>
);

class TaskLabels extends React.Component {
  render() {
    const labels = [];
    if (this.props.task.subject_id) {
      labels.push(
        <Label 
          name={this.props.task.subject_name} 
          color={this.props.task.subject_color} 
          onModal={(x, y) => this.props.onModal(this.props.task.category_id ? 'subjects' : 'labels', x, y)}
        />
      );
    }

    if (this.props.task.category_id) {
      labels.push(
        <Label 
          name={this.props.task.category_name}
          color={this.props.task.category_color}
          onModal={(x, y) => this.props.onModal(this.props.task.subject_id ? 'categories' : 'labels', x, y)}
        />
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