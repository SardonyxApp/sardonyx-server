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
import Profile from './modals/Profile';
import LabelsSelector from './modals/LabelsSelector';
import ModalBackground from './modals/ModalBackground';
import TasklistSelector from './modals/TasklistSelector';

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
        id: null,
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

    this.handleModal = this.handleModal.bind(this);
    this.handleSelectTasklist = this.handleSelectTasklist.bind(this);
    this.handleSelectTask = this.handleSelectTask.bind(this);
    this.handleAddFilter = this.handleAddFilter.bind(this);
    this.handleRemoveFilter = this.handleRemoveFilter.bind(this);
    this.handleChangeTask = this.handleChangeTask.bind(this);
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

  handleSelectTasklist(tasklist) {
    Promise.all([
      fetch(`/app/tasks?full=true&year=${tasklist.id + 2017}`).then(response => response.json()),
      fetch(`/app/subjects?year=${tasklist.id + 2017}`).then(response => response.json()),
      fetch(`/app/categories?year=${tasklist.id + 2017}`).then(response => response.json())
    ]).then(responses => {
      this.setState({
        tasklist: tasklist,
        tasks: responses[0],
        subjects: responses[1],
        categories: responses[2]
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

  handleChangeTask(property, content) {
    const index = this.state.tasks.findIndex(t => t.id === this.state.currentTask);
    const tasks = this.state.tasks;
    tasks[index][property] = content;

    this.setState({ tasks });
  }

  render() {
    return (
      <div>
        <TopBar 
          user={this.state.user}
          tasklist={this.state.tasklist} 
          onModal={this.handleModal}
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
            onChangeTask={this.handleChangeTask}
          />
        </div>
        <Profile 
          user={this.state.user}
          modal={this.state.modal}
        />
        <TasklistSelector 
          user={this.state.user}
          tasklist={this.state.tasklist}
          modal={this.state.modal}
          onSelectTasklist={this.handleSelectTasklist}
        />
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
        <ModalBackground 
          modal={this.state.modal}
          onModal={this.handleModal}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));