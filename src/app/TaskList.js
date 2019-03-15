/**
 * @fileoverview Component to render the tasklist view.
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';

class TaskList extends React.Component {
  render() {
    // Temporarily store values for comparison 
    let store = null

    let tasks = this.props.tasks.sort((a, b) => {
      // convert null to "null" so that they come last
      if (String(a.due) < String(b.due)) return -1;
      else if (String(a.due) > String(b.due)) return 1;
      return 0; // They are equal
    }).map((t, i) => {
      // This gets messy here, but it was kept as a single component in order to refer back to store 
      const view = (
        <div>
          <div className="side">
            <p>{store === t.due ? null : new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date(t.due))}</p>
            <p>{store === t.due ? null : new Date(t.due).getDate()}</p>
          </div>
          <div 
            className="card" 
            key={t.id} 
            onClick={() => this.props.onSelectTask(i)}
            style={{ backgroundColor: this.props.currentTask === i ? '#f6e6dc' : ''}}
          >
            <h3 className="overview-title">{t.name}</h3>
            <p className="overview-description">{t.description}</p>
            <div className="overview-dots">
              <div class="dot" style={{ backgroundColor: t.subject_color }}></div>
              <div class="dot" style={{ backgroundColor: t.category_color }}></div>
            </div>
          </div>
        </div>
      );
      store = t.due;
      return view;
    });
  
    return (
      <div id="tasklist" className="left-view">
        <p style={{flex: 'none'}}>UPCOMING</p>
        <div className="tasks-container">{tasks}</div>
      </div>
    );
  }
}

export default TaskList;