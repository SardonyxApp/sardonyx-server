/**
 * @fileoverview Component to render the due date for a task in info view. 
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';
import { TimeIcon } from '../../logos';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

class TaskDue extends React.Component {
  render() {
    return (
      <div id="task-due" className="taskinfo-component">
        <TimeIcon />
        {/* <p>Due {this.props.due ? new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' }).format(new Date(this.props.due)) : 'date not set'}</p> */}
        <DatePicker
          selected={this.props.due}
          onChange={date => this.props.onChangeTask({ due: date.toISOString() })}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="MMMM d, yyyy h:mm aa"
        />
      </div>
    );
  }
}

export default TaskDue;