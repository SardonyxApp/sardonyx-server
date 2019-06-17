import React from 'react';

const TaskListCard = props => (
  <div 
    className="card" 
    key={props.task.id} 
    onClick={() => props.onSelectTask(props.task.id)}
    style={{ backgroundColor: props.selected ? '#f6e6dc' : ''}}
  >
    <h3 className="overview-title">{props.task.name}</h3>
    <p className="overview-description">{props.task.description}</p>
    <div className="overview-dots" style={{ display: props.task.subject_id || props.task.category_id ? '' : 'none'}}>
      <div className="dot" style={{ backgroundColor: props.task.subject_color, display: props.task.subject_id ? '' : 'none' }}></div>
      <div className="dot" style={{ backgroundColor: props.task.category_color, display: props.task.category_id ? '' : 'none' }}></div>
    </div>
  </div>
);

class TasksContainer extends React.Component {
  render() {
    // Apply filters 
    let tasks = this.props.subjectsFilter.length || this.props.categoriesFilter.length
      ? this.props.tasks.filter(t => this.props.subjectsFilter.includes(t.subject_id) || this.props.categoriesFilter.includes(t.category_id))
      : this.props.tasks;

    // Re-sort by date
    tasks = tasks.sort((a, b) => new Date(a.due).valueOf() - new Date(b.due).valueOf());

    // Count the number of cards 
    let count = 0;

    // Temporarily store values for comparison 
    let store = null;

    const todayTasks = tasks.filter(t => new Date().toDateString() === new Date(t.due).toDateString()).map((t, i) => (
      <div>
        <div className="side">
          {i === 0 ? <p>{new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date(t.due))}</p> : null}
          {i === 0 ? <p>{new Date(t.due).getDate()}</p> : null}
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
      const due = new Date(t.due);
      const view = (
        <div>
          <div className="side">
            {store === due.toDateString() ? null : <p>{new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(due)}</p>}
            {store === due.toDateString() ? null : <p>{due.getDate()}</p>}
          </div>
          <TaskListCard 
            task={t}
            selected={this.props.currentTask === t.id}
            onSelectTask={this.props.onSelectTask}
          />
        </div>
      );
      store = due.toDateString();
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
      const due = new Date(t.due);
      const view = (
        <div>
          <div className="side">
            {store === due.toDateString() ? null : <p>{new Intl.DateTimeFormat('en-US', { month: 'short' }).format(due)}</p>}
            {store === due.toDateString() ? null : <p>{new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(due)}</p>}
          </div>
          <TaskListCard 
            task={t}
            selected={this.props.currentTask === t.id}
            onSelectTask={this.props.onSelectTask}
          />
        </div>
      );
      store = due.toDateString();
      return view;
    });

    return (
      <div id="tasks-container" className="custom-scroll">
        <h4 
          className="subheading" 
          style={{ display: todayTasks.length ? '' : 'none' }}
        >
          Today
        </h4>
        {todayTasks}
        <h4 
          className="subheading" 
          style={{ display: upcomingTasks.length ? '' : 'none', marginTop: todayTasks.length ? '16px' : 0 }}
        >
          Upcoming
        </h4>
        {upcomingTasks}
        <h4 
          className="subheading" 
          style={{ display: noDateTasks.length ? '' : 'none', marginTop: todayTasks.length || upcomingTasks.length ? '16px' : 0 }}
        >
          No date set
        </h4>
        {noDateTasks}
        <h4 
          className="subheading" 
          style={{ display: pastTasks.length ? '' : 'none', marginTop: todayTasks.length || upcomingTasks.length || noDateTasks.length ? '16px' : 0 }}
        >
          Past due
        </h4>
        {pastTasks}
        <h4 
          className="subheading" 
          style={{ display: tasks.length ? 'none' : '' }}
        >
          No tasks found
        </h4>
        {this.props.displayPastTasks ? null : <div className="loader" onClick={this.props.onLoadAllTasks}>Load more tasks</div>}
      </div>
    );
  }
}

export default TasksContainer;