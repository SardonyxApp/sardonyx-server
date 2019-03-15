/**
 * @fileoverview Component to render the tasklist view.
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';

class TaskList extends React.Component {
  render() {
    let tasks = this.props.tasks.sort((a, b) => {
      // convert null to "null" so that they come last
      if (String(a.due) < String(b.due)) return -1;
      else if (String(a.due) > String(b.due)) return 1;
      return 0; // They are equal
    }).map((t, i) => (
      <div 
        className="card" 
        key={t.id} 
        onClick={() => this.props.onSelectTask(i)}
        style={{ backgroundColor: this.props.currentTask === i ? '#f6e6dc' : ''}}
      >
        <h3 className="overview-title">{t.name}</h3>
        <p className="overview-description">{t.description}</p>
      </div>
    ));
  
    return (
      <div id="tasklist" className="left-view">
        <p style={{flex: 'none'}}>UPCOMING</p>
        <div className="tasks-container">{tasks}</div>
      </div>
    );
  }
}

export default TaskList;