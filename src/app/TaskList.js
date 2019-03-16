/**
 * @fileoverview Component to render the tasklist view.
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';

class TaskListCard extends React.Component {
  render() {
    return (
      <div 
        className="card" 
        key={this.props.task.id} 
        onClick={() => this.props.onSelectTask(this.props.index)}
        style={{ backgroundColor: this.props.currentTask === this.props.index ? '#f6e6dc' : ''}}
      >
        <h3 className="overview-title">{this.props.task.name}</h3>
        <p className="overview-description">{this.props.task.description}</p>
        <div className="overview-dots" style={{ display: !!this.props.task.subject_id || !!this.props.task.category_id ? 'flex' : 'none'}}>
          <div class="dot" style={{ backgroundColor: this.props.task.subject_color, display: !!this.props.task.subject_id ? 'block' : 'none' }}></div>
          <div class="dot" style={{ backgroundColor:this.props.task.category_color, display: !!this.props.task.category_id ? 'block' : 'none' }}></div>
        </div>
      </div>
    );
  }
}

class TaskList extends React.Component {
  render() {
    // Count the number of cards 
    let count = 0;

    // Temporarily store values for comparison 
    let store = null;

    const todayTasks = this.props.tasks.filter(t => new Date().toDateString() === new Date(t.due).toDateString()).map((t, i) => (
      <div>
        <div className="side">
          <p>{i === 0 ? null : new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date(t.due))}</p>
          <p>{i === 0 ? null : new Date(t.due).getDate()}</p>
        </div>
        <TaskListCard 
          task={t}
          index={i}
          currentTask={this.props.currentTask}
          onSelectTask={this.props.onSelectTask}
        />
      </div>
    ));
    count += todayTasks.length - 1;

    const upcomingTasks = this.props.tasks.filter(t => new Date().toDateString() !== new Date(t.due).toDateString() && new Date() < new Date(t.due)).map((t, i) => {
      const view = (
        <div>
          <div className="side">
            <p>{store === t.due ? null : new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date(t.due))}</p>
            <p>{store === t.due ? null : new Date(t.due).getDate()}</p>
          </div>
          <TaskListCard 
            task={t}
            index={count + i}
            currentTask={this.props.currentTask}
            onSelectTask={this.props.onSelectTask}
          />
        </div>
      );
      store = t.due;
      return view;
    });
    count += upcomingTasks.length - 1;

    const noDateTasks = this.props.tasks.filter(t => t.due === null).map((t, i) => (
      <div>
        <div className="side"></div>
        <TaskListCard 
          task={t}
          index={count + i}
          currentTask={this.props.currentTask}
          onSelectTask={this.props.onSelectTask}
        />
      </div>
    ));
    count += noDateTasks.length - 1;

    const pastTasks = this.props.tasks.filter(t => t.due !== null && new Date().toDateString() !== new Date(t.due).toDateString() && new Date() > new Date(t.due)).reverse().map((t, i) => {
      const view = (
        <div>
          <div className="side">
            <p>{store === t.due ? null : new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(t.due))}</p>
            <p>{store === t.due ? null : new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(new Date(t.due))}</p>
          </div>
          <TaskListCard 
            task={t}
            index={count + i}
            currentTask={this.props.currentTask}
            onSelectTask={this.props.onSelectTask}
          />
        </div>
      );
      store = t.due;
      return view;
    });

    return (
      <div id="tasklist" className="left-view">
        <div className="tasks-container">
          <h4 className="group" style={{ display: todayTasks.length ? 'block' : 'none' }}>Today</h4>
          {todayTasks}
          <h4 className="group" style={{ display: upcomingTasks.length ? 'block' : 'none' }}>Upcoming</h4>
          {upcomingTasks}
          <h4 className="group" style={{ display: noDateTasks.length ? 'block' : 'none'} }>No date set</h4>
          {noDateTasks}
          <h4 className="group" style={{ display: pastTasks.length ? 'block' : 'none' }}>Past</h4>
          {pastTasks}
        </div>
      </div>
    );
  }
}

export default TaskList;