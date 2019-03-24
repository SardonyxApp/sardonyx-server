/**
 * @fileoverview Front end app for Sardonyx tasklists.
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';
import ReactDOM from 'react-dom';
import './app.scss';

// Main components 
import TopBar from './TopBar';
import TaskList from './TaskList';
import TaskInfo from './TaskInfo';

import ModalBackground from './modals/ModalBackground';

// Modals 
import TasklistModal from './modals/TasklistModal';
import ProfileModal from './modals/ProfileModal';
import AddModal from './modals/AddModal';
import LabelsModal from './modals/LabelsModal';

class App extends React.Component {
  constructor(props) {
    super(props);

    // Set initial state with empty values to not cause any rendering errors 
    this.state = {  
      modal: {
        name: null,
        x: null,
        y: null
      }, 
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
    };

    this.handleModal = this.handleModal.bind(this);
    this.handleSelectTasklist = this.handleSelectTasklist.bind(this);
    this.handleSelectTask = this.handleSelectTask.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.handleChangeTask = this.handleChangeTask.bind(this);
  }

  // Safely fetch data after initial render 
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
      console.error(err); // For now 
    });
  }

  // Open / close modals 
  handleModal(name = null, x = null, y = null) {
    this.setState({
      modal: { name, x, y } // x and y coordinates can either be used for left or right, depending on modal 
    });
  }

  // Fetch data to change tasklist 
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
      console.error(err); // For now
    });
  }

  // Update current task 
  handleSelectTask(i) {
    this.setState(prevState => ({
      currentTask: prevState.currentTask === i ? -1 : i
    }));
  }

  // Update filter list 
  handleFilter(type, id) {
    this.setState(prevState => {
      const obj = {};
      obj[type] = prevState[type].includes(id) ? prevState[type].filter(l => l !== id) : prevState[type].concat([id]);
      return obj;
    });
  }

  // Update task content 
  handleChangeTask(obj) {
    this.setState(prevState => {
      const tasks = prevState.tasks;
      const index = tasks.findIndex(t => t.id === prevState.currentTask);
      tasks[index] = Object.assign(tasks[index], obj);
      return { tasks };
    });
  }

  render() {
    return (
      <div>
        <TasklistModal 
          user={this.state.user}
          tasklist={this.state.tasklist}
          modal={this.state.modal}
          onModal={this.handleModal}
          onSelectTasklist={this.handleSelectTasklist}
        />
        <ProfileModal 
          user={this.state.user}
          modal={this.state.modal}
        />
        <AddModal 
          modal={this.state.modal}
          onModal={this.handleModal}
        />
        <LabelsModal
          task={this.state.tasks.filter(t => t.id === this.state.currentTask)[0]}
          subjects={this.state.subjects}
          categories={this.state.categories}
          subjectsFilter={this.state.subjectsFilter}
          categoriesFilter={this.state.categoriesFilter}
          modal={this.state.modal}
          onModal={this.handleModal}
          onFilter={this.handleFilter}
          onChangeTask={this.handleChangeTask}
        />
        
        <ModalBackground 
          modal={this.state.modal}
          onModal={this.handleModal}
        />

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
            onFilter={this.handleFilter}
          />
          <TaskInfo 
            task={this.state.currentTask === -1 ? null : this.state.tasks.filter(t => t.id === this.state.currentTask)[0]}
            onModal={this.handleModal}
            onChangeTask={this.handleChangeTask}
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));