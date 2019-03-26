/**
 * @fileoverview Component to render the due date for a task in info view. 
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';
import { TimeIcon, RemoveIcon } from '../../logos';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

class TaskDue extends React.Component {
  render() {
    return (
      <div id="task-due" className="taskinfo-component">
        <TimeIcon />
        <DatePicker
          selected={this.props.due}
          onChange={date => this.props.onChangeTask({ due: date.toISOString()})}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={30}
          dateFormat="MMMM d, yyyy h:mm aa"
          placeholderText="No due date set."
        />
        <RemoveIcon 
          width={16}
          height={16}
          style={{ display: this.props.due ? '' : 'none' }}
          onClick={() => this.props.onChangeTask({ due: null })}
        />
      </div>
    );
  }
}

export default TaskDue;