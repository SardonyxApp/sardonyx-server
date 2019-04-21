import React from 'react';

import InfoModal from './InfoModal';
import SettingsModal from './SettingsModal';
import TasklistModal from './TasklistModal';
import ProfileModal from './ProfileModal';
import AddMenuModal from './AddMenuModal';
import AddTaskModal from './AddTaskModal';
import AddLabelModal from './AddLabelModal';
import LabelsModal from './LabelsModal';

const PrimaryModals = props => {
  switch(props.modal.name) {
    case 'info':
      return <InfoModal 
        user={props.user}
        modal={props.modal}        
        onModal={props.onModal}
      />;
    case 'settings':
      return <SettingsModal 
        user={props.user}
        tasklist={props.tasklist}
        tasklists={props.tasklists}
        subjects={props.subjects}
        categories={props.categories}

        onCreateLabel={props.onCreateModal}
        onUpdateLabel={props.onUpdateLabel}
        onDeleteLabel={props.onDeleteLabel}
        onUpdateUserLabel={props.onUpdateUserLabel}
        onChangeUserTasklist={props.onChangeUserTasklist}

        modal={props.modal}
        onModal={props.onModal}
        onSecondModal={props.onSecondModal}
      />;
    case 'tasklists':
      return <TasklistModal 
        user={props.user}
        tasklist={props.tasklist}
        tasklists={props.tasklists}

        onSelectTasklist={props.onSelectTasklist}

        modal={props.modal}
        onModal={props.onModal}
      />;
    case 'profile':
      return <ProfileModal 
        user={props.user}
        
        modal={props.modal}
        onModal={props.onModal}
      />;
    case 'add':
      return <AddMenuModal 
        modal={props.modal}
        onModal={props.onModal}
      />;
    case 'add-task':
      return <AddTaskModal 
        onCreateTask={props.onCreateTask}

        modal={props.modal}
        onModal={props.onModal}
      />;
    case 'add-subject':
    case 'add-category':
      return <AddLabelModal 
        onCreateLabel={props.onCreateLabel}

        modal={props.modal}
        onModal={props.onModal}
        zIndex={3}
      />;
    case 'subjects':
    case 'categories':
    case 'labels':
    case 'filter':
      return <LabelsModal 
        task={props.task}
        subjects={props.subjects}
        categories={props.categories}
        subjectsFilter={props.subjectsFilter}
        categoriesFilter={props.categoriesFilter}

        onFilter={props.onFilter}
        onUpdateTask={props.onUpdateTask}

        modal={props.modal}
        onModal={props.onModal}
        zIndex={3}
      />;
    default: 
      return null;
  }
};

export default PrimaryModals;