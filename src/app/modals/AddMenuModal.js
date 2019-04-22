import React from 'react';

const AddMenuModal = props => {
  // Render the default add options 
  return (
    <div id="add-modal" className="modal" style={props.modal.position}>
      <ul>
        <li onClick={() => props.onModal('add-task', props.modal.position)}>Add task</li>
        <li onClick={() => props.onModal('add-subject', props.modal.position)}>Add subject label</li>
        <li onClick={() => props.onModal('add-category', props.modal.position)}>Add category label</li>
      </ul>
    </div>
  );
};

export default AddMenuModal;