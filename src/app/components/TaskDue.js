import React from 'react';
import { TimeIcon, RemoveIcon } from '../../logos';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TaskDue = props => (
  <div id="task-due" className="taskinfo-component">
    <TimeIcon />
    <DatePicker
      selected={props.due}
      onChange={date => props.onUpdateTask({ id: props.id, due: date.toISOString() })}
      showTimeSelect
      timeFormat="HH:mm"
      timeIntervals={30}
      dateFormat="MMMM d, yyyy h:mm aa"
      placeholderText="No due date set."
    />
    <RemoveIcon 
      width={16}
      height={16}
      style={{ visibility: props.due ? '' : 'hidden' }}
      onClick={() => props.onUpdateTask({ id: props.id, due: null })}
    />
  </div>
);

export default TaskDue;