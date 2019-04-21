import React from 'react';

import HandleLabelModal from './HandleLabelModal';
import LabelsModal from './LabelsModal';

const SecondaryModals = props => {
  switch(props.modal.name) {
    case 'add-subject':
    case 'add-category':
    case 'edit-subject':
    case 'edit-category':
      return <HandleLabelModal
        subjects={props.subjects}
        categories={props.categories}
        onCreateLabel={props.onCreateLabel}
        onUpdateLabel={props.onUpdateLabel}

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