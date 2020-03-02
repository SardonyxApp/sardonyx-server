import React from 'react';
import { CheckIcon } from '../../logos';

const TasklistOverview = props => (
  <div className="overview-tasklist" style={props.style} onClick={props.onClick}>
    <div>
      <h3>{props.name}</h3>
      {props.checked ? <CheckIcon /> : null}
    </div>
    <p className="overview-description">{props.description}</p>
  </div>
);

class TasklistModal extends React.Component {
  handleSelect(tasklist) {
    this.props.onModal();
    this.props.onSelectTasklist(tasklist);
  }

  render() {
    const tasklists = this.props.tasklists.map(tasklist => (
        tasklist.id === this.props.tasklist.id ? (
          <TasklistOverview 
            name={tasklist.name} 
            description={tasklist.description} 
            checked={true} 
            style={{ backgroundColor: '#f6e6dc' }} 
          />
        ) : (
          <TasklistOverview 
            name={tasklist.name}
            description={tasklist.description}
            checked={false}
            style={{ cursor: 'pointer' }}
            onClick={() => this.handleSelect(tasklist)}
          />
        )  
      ));

    // Position is set statically in CSS 
    return (
      <div id="tasklist-modal" className="modal" style={this.props.modal.position}>
        {tasklists}
      </div>
    );
  }
}

export default TasklistModal;