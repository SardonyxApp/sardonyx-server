/**
 * @fileoverview Component to render the tasklist selector modal.
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';
import { CheckIcon } from '../../logos';

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
    fetch('/app/tasklist?year=all').then(response => response.json()).then(results => {
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
          <div className="overview-tasklist" style={{ backgroundColor: '#f6e6dc' }}>
            <div>
              <h3>{tasklist.name}</h3>
              <CheckIcon />
            </div>
            <p className="overview-description">{tasklist.description}</p>
          </div>
        ) : (
          <div className="overview-tasklist" style={{ cursor: 'pointer' }} onClick={() => this.handleSelect(tasklist)}>
            <div>
              <h3>{tasklist.name}</h3>
            </div>
            <p className="overview-description">{tasklist.description}</p>
          </div>
        )  
      )) : (
        <div className="overview-tasklist">
          <div>
            <h3>{this.props.tasklist.name}</h3>
            <CheckIcon />
          </div>
          <p className="overview-description">{this.props.tasklist.description}</p>
        </div>
      );

    // Position is set statiscally in CSS 
    return this.props.modal.name === 'tasklists' ? (
      <div id="tasklist-modal" className="modal">
        {tasklists}
      </div>
    ) : null;
  }
}

export default TasklistModal;