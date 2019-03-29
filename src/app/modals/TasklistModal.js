/**
 * @fileoverview Component to render the tasklist selector modal.
 * @author SardonyxApp
 * @license MIT 
 */

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
  constructor(props) {
    super(props);
    this.state = {
      tasklists: [
        {
          id: null,
          name: '',
          description: ''
        }
      ]
    }
  }

  componentDidMount() {
    fetch('/app/tasklist?tasklist=all', { credentials: 'include' })
    .then(response => response.json())
    .then(results => {
      this.setState({
        tasklists: results
      });
    }).catch(err => {
      console.error('If you are a student, do not worry about this error. ' + err);
    });
  }

  handleSelect(tasklist) {
    this.props.onModal();
    this.props.onSelectTasklist(tasklist);
  }

  render() {
    const tasklists = this.props.user.teacher
      ? this.state.tasklists.map(tasklist => (
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
      )) : (
        <TasklistOverview 
          name={this.props.tasklist.name} 
          description={this.props.tasklist.description} 
          checked={true} 
        />
      );

    // Position is set statiscally in CSS 
    return this.props.modal.name === 'tasklists' ? (
      <div id="tasklist-modal" className="modal" style={{ left: this.props.modal.x, top: this.props.modal.y }}>
        {tasklists}
      </div>
    ) : null;
  }
}

export default TasklistModal;