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

// Modals 
import SettingsModal from './modals/SettingsModal';
import TasklistModal from './modals/TasklistModal';
import ProfileModal from './modals/ProfileModal';
import AddModal from './modals/AddModal';
import LabelsModal from './modals/LabelsModal';

import ModalBackground from './modals/ModalBackground';

class App extends React.Component {
  constructor(props) {
    super(props);

    // Set initial state with empty values to not cause any rendering errors 
    this.state = { 
      // Display state 
      modal: { // First level modal 
        name: null,
        x: null,
        y: null
      },
      secondModal: { // Second level modal 
        name: null,
        x: null,
        y: null
      },

      // Data state 
      user: { 
        teacher: false,
        name: '', 
        email: '',
        subjects: [],
        categories: []
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
    this.handleSecondModal = this.handleSecondModal.bind(this);
    this.handleSelectTasklist = this.handleSelectTasklist.bind(this);
    this.handleSelectTask = this.handleSelectTask.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.handleCreateTask = this.handleCreateTask.bind(this);
    this.handleUpdateTask = this.handleUpdateTask.bind(this);
    this.handleDeleteTask = this.handleDeleteTask.bind(this);
    this.handleCreateLabel = this.handleCreateLabel.bind(this);
    this.handleUpdateLabel = this.handleUpdateLabel.bind(this);
    this.handleDeleteLabel = this.handleDeleteLabel.bind(this);
    this.handleUpdateUserLabel = this.handleUpdateUserLabel.bind(this);
  }

  // Safely fetch data after initial render 
  componentDidMount() {
    Promise.all([
      fetch('/app/user', { credentials: 'include' }).then(response => response.json()),
      fetch('/app/tasklist', { credentials: 'include' }).then(response => response.json()),
      fetch('/app/tasks?full=true', { credentials: 'include' }).then(response => response.json()),
      fetch('/app/subjects', { credentials: 'include' }).then(response => response.json()),
      fetch('/app/categories', { credentials: 'include' }).then(response => response.json())
    ]).then(responses => {
      this.setState({
        user: responses[0],
        tasklist: responses[1],
        tasks: responses[2],
        subjects: responses[3],
        categories: responses[4],
        subjectsFilter: responses[0].subjects,
        categoriesFilter: responses[0].categories,
      });
    }).catch(err => {
      alert('There was an error while retrieving information. If this error persists, please contact SardonyxApp.');
      console.error(err); 
    });
  }

  /**
   * Manage open/closed modals 
   * @param {String} name 
   * @param {Number|String} x number or pixels in string
   * @param {Number|String} y number or pixels in string
   */
  handleModal(name = null, x = null, y = null) {
    this.setState({
      modal: { name, x, y } // x and y coordinates can either be used for left or right, depending on modal 
    });
  }
  handleSecondModal(name = null, x = null, y= null) {
    this.setState({
      secondModal: { name, x, y }
    });
  }

  // Fetch data to change tasklist 
  handleSelectTasklist(tasklist) {
    Promise.all([
      // Fetch user because the default filters change 
      fetch(`/app/user?tasklist=${tasklist.id}`, { credentials: 'include' }).then(response => response.json()),
      fetch(`/app/tasks?full=true&tasklist=${tasklist.id}`, { credentials: 'include' }).then(response => response.json()),
      fetch(`/app/subjects?tasklist=${tasklist.id}`, { credentials: 'include' }).then(response => response.json()),
      fetch(`/app/categories?tasklist=${tasklist.id}`, { credentials: 'include' }).then(response => response.json())
    ]).then(responses => {
      this.setState({
        user: responses[0],
        tasklist: tasklist,
        tasks: responses[1],
        subjects: responses[2],
        categories: responses[3],
        currentTask: -1,
        subjectsFilter: responses[0].subjects,
        categoriesFilter: responses[0].categories
      });
    }).catch(err => {
      alert('There was an error while retrieving information. If this error persists, please contact SardonyxApp.');
      console.error(err);
    });
  }

  // Update current task 
  handleSelectTask(i) {
    this.setState(prevState => ({
      currentTask: prevState.currentTask === i ? -1 : i
    }));
  }

  /**
   * @description Update TaskFilter 
   * @param {String} type subjects or categories 
   * @param {Number} id 
   */ 
  handleFilter(type, id) {
    this.setState(prevState => {
      const obj = {};
      obj[type] = prevState[type].includes(id) ? prevState[type].filter(l => l !== id) : prevState[type].concat([id]);
      return obj;
    });
  }

  /**
   * @description Create a new task 
   * @param {Object} obj task object 
   */
  handleCreateTask(obj) {
    const task = {
      name: obj.name || '',
      description: obj.description || null,
      due: obj.due || null,
      tasklist_id: this.state.tasklist.id,
      student_id: this.state.user.teacher ? null : this.state.user.id,
      teacher_id: this.state.user.teacher ? this.state.user.id : null,
      subject_id: obj.subject_id || null,
      category_id: obj.category_id || null
    };

    fetch('/app/task', {
      method: 'POST',
      body: JSON.stringify(task),
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(response => {
      this.setState(prevState => {
        const tasks = prevState.tasks;
        tasks.push(Object.assign({
          id: response.insertId,
          student_name: prevState.user.teacher ? null : prevState.user.name,
          teacher_name: prevState.user.teacher ? prevState.user.name : null,
          subject_name: null, // TODO: initially set these according to task.subject_id 
          subject_color: null,
          category_name: null,
          category_color: null
        }, task));

        return {
          currentTask: response.insertId,
          tasks
        };
      });
    }).catch(err => {
      alert('There was an error while creating a new task. If this error persists, please contact SardonyxApp.');
      console.error(err);
    });
  }

  /**
   * @description Update task content 
   * @param {Object} obj task object with any key value pair that is to be changed  
   * @param {Number} id required in order to change state correctly 
   */
  handleUpdateTask(obj) {
    // Deep copy object
    const body = JSON.parse(JSON.stringify(obj));

    // Stored in separate DB table, do not need to be updated 
    delete body.subject_name;
    delete body.subject_color;
    delete body.category_name;
    delete body.category_color;

    // Send the request 
    fetch(`/app/task?id=${obj.id}`, {
      body: JSON.stringify(body),
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      // Update local state using local data, as response object does not return tables 
      this.setState(prevState => {
        const tasks = prevState.tasks;
        const index = tasks.findIndex(t => t.id === obj.id);
        tasks[index] = Object.assign(tasks[index], obj);
        return { tasks };
      });
    }).catch(err => {
      alert('There was an error while editing a task. If this error persists, please contact SardonyxApp.');
      console.error(err);
    });
  }

  /**
   * Delete a task 
   * @param {String|Number} id 
   */
  handleDeleteTask(id) {
    fetch(`/app/task?id=${id}`, {
      method: 'DELETE',
      credentials: 'include',
    }).then(() => {
      this.setState(prevState => {
        return {
          tasks: prevState.tasks.filter(t => t.id !== id),
          currentTask: -1
        };
      });
    }).catch(err => {
      alert('There was an error while deleting a task. If this error persists, please contact SardonyxApp.');
      console.error(err);
    });
  }

  /**
   * @description Create a label
   * @param {String} type subjects or categories
   * @param {Object} obj label object
   */ 
  handleCreateLabel(type, obj) {
    obj.tasklist_id = this.state.tasklist.id;

    fetch(`/app/${type}`, {
      method: 'POST',
      body: JSON.stringify(obj),
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(response => {
      this.setState(prevState => {
        const payload = {};
        payload[type] = prevState[type].concat(Object.assign({
          id: response.insertId          
        }, obj));
        return payload;
      });
    }).catch(err => {
      alert('There was an error while creating a label. If this error persists, please contact SardonyxApp.');
      console.error(err);
    });
  }

  /**
   * @description Update a label 
   * @param {String} type subjects or categories 
   * @param {Object} obj
   * @param {Object} obj.id required 
   * @param {String} obj.name 
   * @param {String} obj.color 
   * @param {String} obj.tasklist_id 
   */
  handleUpdateLabel(type, obj) {
    fetch(`/app/${type}?id=${obj.id}`, {
      method: 'PATCH',
      body: JSON.stringify(obj),
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      this.setState(prevState => {
        const payload = {};
        const labels = prevState[type];
        const index = labels.findIndex(l => l.id === obj.id);
        labels[index] = Object.assign(labels[index], obj);
        payload[type] = labels;
        return payload;
      });
    }).catch(err => {
      alert('There was an error while editing a label. If this error persists, please contact SardonyxApp.');
      console.error(err);
    });
  }

  /**
   * @description Delete a label 
   * @param {String} type subjects or categories 
   * @param {Number} id 
   */
  handleDeleteLabel(type, id) {
    fetch(`/app/${type}?id=${id}`, {
      method: 'DELETE',
      credentials: 'include'
    }).then(() => {
      this.setState(prevState => {
        const payload = {};
        payload[type] = prevState[type].filter(l => l.id !== id)
        return payload;
      });
    }).catch(err => {
      alert('There was an error while deleting a label. If this error persists, please contact SardonyxApp.');
      console.error(err);
    })
  }

  /**
   * @description Add or delete a user's default label
   * @param {String} type 
   * @param {Number} id 
   */
  handleUpdateUserLabel(type, id) {
    const method = this.state.user[type].includes(id) ? 'DELETE' : 'POST';
    fetch(`/app/user/${type}?id=${id}`, {
      method,
      credentials: 'include'
    }).then(() => {
      this.setState(prevState => {
        const user = prevState.user;
        user[type] = method === 'POST' ? user[type].concat([id]) : user[type].filter(l => l !== id);
        return { user };
      });
    }).catch(err => {
      alert('There was an error while updating default labels. If this error persists, please contact SardonyxApp.');
      console.error(err);
    }) 
  }

  render() {
    return (
      <div>
        {/* Primary modals */}
        <SettingsModal 
          user={this.state.user}
          tasklist={this.state.tasklist}
          subjects={this.state.subjects}
          categories={this.state.categories}
          modal={this.state.modal}
          onModal={this.handleModal}
          onSecondModal={this.handleSecondModal}
          onCreateLabel={this.handleCreateLabel}
          onUpdateLabel={this.handleUpdateLabel}
          onDeleteLabel={this.handleDeleteLabel}
          onUpdateUserLabel={this.handleUpdateUserLabel}
        />
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
          onModal={this.handleModal}
        />
        <AddModal
          user={this.state.user} 
          modal={this.state.modal}
          onModal={this.handleModal}
          onCreateTask={this.handleCreateTask}
          onCreateLabel={this.handleCreateLabel}
          zIndex={3}
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
          onUpdateTask={this.handleUpdateTask}
          zIndex={3}
        />
        
        <ModalBackground 
          modal={this.state.modal}
          onModal={this.handleModal}
          zIndex={2}
        />

        {/* Secondary modals */}
        <AddModal
          user={this.state.user} 
          modal={this.state.secondModal}
          onModal={this.handleSecondModal}
          onCreateTask={this.handleCreateTask}
          onCreateLabel={this.handleCreateLabel}
          zIndex={5}
        />
        <LabelsModal
          subjects={this.state.subjects}
          categories={this.state.categories}
          subjectsFilter={this.state.user.subjects}
          categoriesFilter={this.state.user.categories}
          modal={this.state.secondModal}
          onModal={this.handleSecondModal}
          onFilter={this.handleUpdateUserLabel}
          zIndex={5}
        />
        <ModalBackground 
          modal={this.state.secondModal}
          onModal={this.handleSecondModal}
          zIndex={4}
        />

        {/* Page */}
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
            onUpdateTask={this.handleUpdateTask}
            onDeleteTask={this.handleDeleteTask}
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));