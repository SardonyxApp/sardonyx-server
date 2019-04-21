import React from 'react';

const AddMenuModal = props => {
  // Render the default add options 
  return (
    <div id="add-modal" className="modal" style={{ right: document.documentElement.clientWidth - props.modal.x, top: props.modal.y }}>
      <ul>
        <li onClick={() => props.onModal('add-task', props.modal.x, props.modal.y)}>Add task</li>
        <li onClick={() => props.onModal('add-subject', props.modal.x, props.modal.y)}>Add subject label</li>
        <li onClick={() => props.onModal('add-category', props.modal.x, props.modal.y)}>Add category label</li>
      </ul>
    </div>
  );
};

export default AddMenuModal;