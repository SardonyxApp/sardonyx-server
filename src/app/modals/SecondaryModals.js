import React from 'react';

import AddLabelModal from './AddLabelModal';
import LabelsModal from './LabelsModal';

const SecondaryModals = props => {
  switch(props.modal.name) {
    case 'add-subject':
    case 'add-category':
      return <AddLabelModal
        onCreateTask={props.onCreateTask} 
        onCreateLabel={props.onCreateLabel}

        modal={props.modal}
        onModal={props.onModal}
        zIndex={5}
      />;
    case 'default-subjects':
    case 'default-categories':
      return <LabelsModal 
        subjects={props.subjects}
        categories={props.categories}
        subjectsFilter={props.user.subjects}
        categoriesFilter={props.user.categories}
        
        onFilter={props.onUpdateUserLabel}

        modal={props.modal}
        onModal={props.onModal}
        zIndex={5}
      />;
    default: 
      return null;
  }
};

export default SecondaryModals;