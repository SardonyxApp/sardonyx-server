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
import LabelsSelector from './modals/LabelsSelector';
import DarkBackground from './modals/DarkBackground';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: null, 
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
      currentTask: -1, // Store the id of current task: -1 -> no task selected 
      subjects: [],
      categories: [],
      subjectsFilter: [],
      categoriesFilter: []
      // store ids of filtered labels
    };

    this.handleSelectTask = this.handleSelectTask.bind(this);
    this.handleAddFilter = this.handleAddFilter.bind(this);
    this.handleRemoveFilter = this.handleRemoveFilter.bind(this);
    this.handleModal = this.handleModal.bind(this);
  }

  componentDidMount() {
    Promise.all([
      fetch('/app/user').then(response => response.json()),
      fetch('/app/tasklist').then(response => response.json()),
      fetch('/app/tasks?full=true').then(response => response.json()),
      fetch('/app/subjects').then(response => response.json()),
      fetch('/app/categories').then(response => response.json())
    ]).then(responses => {
      this.setState({
        user: responses[0],
        tasklist: responses[1],
        tasks: responses[2],
        subjects: responses[3],
        categories: responses[4]
      });
    }).catch(err => {
      console.error(err);
    });
  }

  handleModal(modal) {
    this.setState({ modal });
  }

  handleSelectTask(i) {
    this.setState({
      currentTask: this.state.currentTask === i ? -1 : i
    });
  }

  handleAddFilter(type, id) {
    if (type === 'subjects') {
      this.setState({
        subjectsFilter: this.state.subjectsFilter.concat([id])
      });
    } else if (type === 'categories') {
      this.setState({
        categoriesFilter: this.state.categoriesFilter.concat([id])
      });
    }
  }

  handleRemoveFilter(type, id) {
    if (type === 'subjects') {
      this.setState({
        subjectsFilter: this.state.subjectsFilter.filter(l => l !== id) 
      });
    } else if (type === 'categories') {
      this.setState({
        categoriesFilter: this.state.categoriesFilter.filter(l => l !== id)
      });
    }
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
            subjects={this.state.subjects}
            categories={this.state.categories}
            currentTask={this.state.currentTask}
            subjectsFilter={this.state.subjectsFilter}
            categoriesFilter={this.state.categoriesFilter}
            onModal={this.handleModal}
            onSelectTask={this.handleSelectTask}
            onAddFilter={this.handleAddFilter}
            onRemoveFilter={this.handleRemoveFilter}
          />
          <TaskInfo 
            task={this.state.currentTask === -1 ? null : this.state.tasks.filter(t => t.id === this.state.currentTask)[0]}
          />
        </div>
        <LabelsSelector
          subjects={this.state.subjects}
          categories={this.state.categories}
          subjectsFilter={this.state.subjectsFilter}
          categoriesFilter={this.state.categoriesFilter}
          modal={this.state.modal}
          onModal={this.handleModal}
          onAddFilter={this.handleAddFilter}
          onRemoveFilter={this.handleRemoveFilter}
        />
        <DarkBackground 
          modal={this.state.modal}
          onModal={this.handleModal}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));