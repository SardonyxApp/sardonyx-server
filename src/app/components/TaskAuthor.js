import React from 'react';
import { UserIcon } from '../../logos';

const TaskAuthor = props => (
  <div 
    id="task-author" 
    className="taskinfo-component" 
    style={{ display: props.author ? '' : 'none' }}
  >
    <UserIcon />
    <p>Added by {props.author}</p>
  </div>
);

export default TaskAuthor; 