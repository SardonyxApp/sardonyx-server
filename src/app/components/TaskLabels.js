import React from 'react';
import { LabelIcon } from '../../logos';
import Label from './Label';

class TaskLabels extends React.Component {
  position(position) {
    return {
      left: position.left,
      top: position.bottom + 8,
      maxHeight: document.documentElement.clientHeight - position.bottom - 48
    };
  }

  render() {
    const labels = [];
    if (this.props.task.subject_id) {
      labels.push(
        <Label 
          label={{
            name: this.props.task.subject_name, 
            color: this.props.task.subject_color
          }}
          onUpdate={e => {
            // If target is <p>, use coordinates of parent .label
            const position = e.target.nodeName === 'DIV' ? e.target.getBoundingClientRect() : e.target.parentNode.getBoundingClientRect();
            this.props.onModal(this.props.task.category_id ? 'subjects' : 'labels', this.position(position));
          }}
          updatable={true}
        />
      );
    }

    if (this.props.task.category_id) {
      labels.push(
        <Label 
          label={{
            name: this.props.task.category_name,
            color: this.props.task.category_color
          }}
          onUpdate={e => {
            // If target is <p>, use coordinates of parent .label
            const position = e.target.nodeName === 'DIV' ? e.target.getBoundingClientRect() : e.target.parentNode.getBoundingClientRect();
            this.props.onModal(this.props.task.subject_id ? 'categories' : 'labels', this.position(position));
          }}
          updatable={true}
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
              return this.props.onModal('labels', this.position(position));
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