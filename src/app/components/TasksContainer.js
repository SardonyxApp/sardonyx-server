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
        onClick={() => this.props.onSelectTask(this.props.task.id)}
        style={{ backgroundColor: this.props.selected ? '#f6e6dc' : ''}}
      >
        <h3 className="overview-title">{this.props.task.name}</h3>
        <p className="overview-description">{this.props.task.description}</p>
        <div className="overview-dots" style={{ display: this.props.task.subject_id || this.props.task.category_id ? '' : 'none'}}>
          <div class="dot" style={{ backgroundColor: this.props.task.subject_color, display: this.props.task.subject_id ? '' : 'none' }}></div>
          <div class="dot" style={{ backgroundColor:this.props.task.category_color, display: this.props.task.category_id ? '' : 'none' }}></div>
        </div>
      </div>
    );
  }
}

class TasksContainer extends React.Component {
  render() {
    const tasks = this.props.subjectsFilter.length || this.props.categoriesFilter.length
      ? this.props.tasks.filter(t => this.props.subjectsFilter.includes(t.subject_id) || this.props.categoriesFilter.includes(t.category_id))
      : this.props.tasks;

    // Count the number of cards 
    let count = 0;

    // Temporarily store values for comparison 
    let store = null;

    const todayTasks = tasks.filter(t => new Date().toDateString() === new Date(t.due).toDateString()).map((t, i) => (
      <div>
        <div className="side">
          <p>{i === 0 ? new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date(t.due)) : null}</p>
          <p>{i === 0 ? new Date(t.due).getDate() : null}</p>
        </div>
        <TaskListCard 
          task={t}
          selected={this.props.currentTask === t.id}
          onSelectTask={this.props.onSelectTask}
        />
      </div>
    ));
    count += todayTasks.length;

    const upcomingTasks = tasks.filter(t => new Date().toDateString() !== new Date(t.due).toDateString() && new Date() < new Date(t.due)).map(t => {
      const view = (
        <div>
          <div className="side">
            <p>{store === t.due ? null : new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date(t.due))}</p>
            <p>{store === t.due ? null : new Date(t.due).getDate()}</p>
          </div>
          <TaskListCard 
            task={t}
            selected={this.props.currentTask === t.id}
            onSelectTask={this.props.onSelectTask}
          />
        </div>
      );
      store = t.due;
      return view;
    });
    count += upcomingTasks.length;

    const noDateTasks = tasks.filter(t => t.due === null).map(t => (
      <div>
        <div className="side"></div>
        <TaskListCard 
          task={t}
          selected={this.props.currentTask === t.id}
          onSelectTask={this.props.onSelectTask}
        />
      </div>
    ));
    count += noDateTasks.length;

    const pastTasks = tasks.filter(t => t.due !== null && new Date().toDateString() !== new Date(t.due).toDateString() && new Date() > new Date(t.due)).reverse().map(t => {
      const view = (
        <div>
          <div className="side">
            <p>{store === t.due ? null : new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(t.due))}</p>
            <p>{store === t.due ? null : new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(new Date(t.due))}</p>
          </div>
          <TaskListCard 
            task={t}
            selected={this.props.currentTask === t.id}
            onSelectTask={this.props.onSelectTask}
          />
        </div>
      );
      store = t.due;
      return view;
    });

    return (
      <div id="tasks-container" className="custom-scroll">
        <h4 
          className="group" 
          style={{ display: todayTasks.length ? '' : 'none', marginTop: '16px' }}
        >
          Today
        </h4>
        {todayTasks}
        <h4 
          className="group" 
          style={{ display: upcomingTasks.length ? '' : 'none', marginTop: todayTasks.length ? 0 : '16px' }}
        >
          Upcoming
        </h4>
        {upcomingTasks}
        <h4 
          className="group" 
          style={{ display: noDateTasks.length ? '' : 'none', marginTop: todayTasks.length && upcomingTasks.length ? 0 : '16px' }}
        >
          No date set
        </h4>
        {noDateTasks}
        <h4 
          className="group" 
          style={{ display: pastTasks.length ? '' : 'none', marginTop: todayTasks.length && upcomingTasks.length && noDateTasks.length ? 0 : '16px' }}
        >
          Past due
        </h4>
        {pastTasks}
        <h4 
          className="group" 
          style={{ display: tasks.length ? 'none' : '', marginTop: '16px' }}
        >
          No tasks found
        </h4>
      </div>
    );
  }
}

export default TasksContainer;