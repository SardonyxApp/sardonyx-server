/**
 * @fileoverview Front end app for Sardonyx tasklists.
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';
import ReactDOM from 'react-dom';
import './app.scss';

import TopBar from './TopBar';
import TaskList from './TaskList';
import TaskInfo from './TaskInfo';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: { 
        teacher: false,
        name: '', 
        email: ''
      },
      tasklist: {
        name: '',
        description: ''
      },
      tasks: [],
      currentTask: -1 // -1 -> no task selected 
    };

    this.handleSelectTask = this.handleSelectTask.bind(this);
  }

  componentDidMount() {
    Promise.all([
      fetch('/app/user').then(response => response.json()),
      fetch('/app/tasklist').then(response => response.json()),
      fetch('/app/tasks?full=true').then(response => response.json())
    ]).then(responses => {
      this.setState({
        user: responses[0],
        tasklist: responses[1],
        tasks: responses[2]
      });
    }).catch(err => {
      console.error(err);
    });
  }

  handleSelectTask(i) {
    this.setState({
      currentTask: this.state.currentTask === i ? -1 : i
    });
  }

  render() {
    return (
      <div>
        <TopBar 
          user={this.state.user}
          tasklist={this.state.tasklist} 
        />
        <div id="content-window" className="content-window">
          <TaskList 
            tasks={this.state.tasks}
            currentTask={this.state.currentTask}
            onSelectTask={this.handleSelectTask}
          />
          <TaskInfo 
            task={this.state.currentTask === -1 ? null : this.state.tasks[this.state.currentTask]}
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));