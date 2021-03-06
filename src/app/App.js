/**
 * @fileoverview Front end app for Sardonyx tasklists.
 * @author SardonyxApp
 * @license MIT 
 */

import React from 'react';
import ReactDOM from 'react-dom';
import './app.scss';
import io from 'socket.io-client';

const socket = io.connect(window.location.origin);

// Main components 
import TopBar from './TopBar';
import TaskList from './TaskList';
import TaskInfo from './TaskInfo';
import PrimaryModals from './modals/PrimaryModals';
import SecondaryModals from './modals/SecondaryModals';
import ModalBackground from './modals/ModalBackground';

Array.prototype.findById = function(id) {
  const index = this.findIndex(i => i.id === id);
  return this[index] || null;
};

class App extends React.Component {
  constructor(props) {
    super(props);

    // Set initial state with empty values to not cause any rendering errors 
    this.state = { 
      // Display state 
      modal: { // First level modal 
        name: location.search.includes('info=true') ? 'info' : null,
        position: null,
        data: null
      },
      secondModal: { // Second level modal 
        name: null,
        position: null,
        data: null
      },

      // Data state 
      user: { 
        name: '', 
        email: '',
        tasklist_id: '',
        subjects: [],
        categories: []
      },
      tasklist: { // Store information about current tasklist 
        id: null,
        name: '',
        description: ''
      },
      tasklists: [], // Store information about other tasklists
      tasks: [],
      currentTask: -1, // Store the id of current task: -1 -> no task selected 
      subjects: [],
      categories: [],
      subjectsFilter: [],
      categoriesFilter: [],

      displayPastTasks: false
    };

    this.handleModal = this.handleModal.bind(this);
    this.handleSecondModal = this.handleSecondModal.bind(this);
    this.handleSelectTasklist = this.handleSelectTasklist.bind(this);
    this.handleSelectTask = this.handleSelectTask.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.handleLoadAllTasks = this.handleLoadAllTasks.bind(this);
    this.handleCreateTask = this.handleCreateTask.bind(this);
    this.handleUpdateTask = this.handleUpdateTask.bind(this);
    this.handleDeleteTask = this.handleDeleteTask.bind(this);
    this.handleCreateLabel = this.handleCreateLabel.bind(this);
    this.handleUpdateLabel = this.handleUpdateLabel.bind(this);
    this.handleDeleteLabel = this.handleDeleteLabel.bind(this);
    this.handleUpdateUserLabel = this.handleUpdateUserLabel.bind(this);
    this.handleChangeUserTasklist = this.handleChangeUserTasklist.bind(this);
  }

  // Safely fetch data after initial render 
  componentDidMount() {
    // Fetch common data 
    Promise.all([
      fetch('/app/user', { credentials: 'include' }).then(response => response.json()),
      fetch(`/app/tasklist`, { credentials: 'include' }).then(response => response.json()),
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
      
      socket.emit('join room', responses[1].id);
    }).catch(err => {
      alert('There was an error while retrieving information. If this error persists, please contact SardonyxApp.');
      console.error(err); 
    });

    fetch('/app/tasklist?tasklist=all', { credentials: 'include' })
    .then(response => response.json())
    .then(response => {
      this.setState({
        tasklists: response
      });
    }).catch(err => {
      console.error('There was an error while retrieving all available tasklists. If this error persists, please contact SardonyxApp.' + err);
    });

    socket.on('tasks', () => {
      fetch(`/app/tasks?tasklist=${this.state.tasklist.id}&full=true${this.state.displayPastTasks ? '&all=true' : ''}`, { credentials: 'include' })
      .then(response => response.json())
      .then(response => {
        this.setState({ 
          tasks: response 
        });
      }).catch(err => {
        alert('There was an error while retrieving information. If this error persists, please contact SardonyxApp.');
        console.error(err);
      });
    });

    socket.on('labels', type => {
      fetch(`/app/${type}?tasklist=${this.state.tasklist.id}`)
      .then(response => response.json())
      .then(response => {
        this.setState(() => {
          const payload = {};
          payload[type] = response;
          return payload;
        });
      }).catch(err => {
        alert('There was an error while retrieving information. If this error persists, please contact SardonyxApp.');
        console.error(err);
      });
    });
  }

  /**
   * Manage open/closed modals 
   * @param {String} name 
   * @param {Object} position coordinates for top, bottom, left, right 
   * @param {Object} data to contain miscellaneous data 
   */
  handleModal(name = null, position = null, data = null) {
    this.setState({
      modal: { name, position, data } // x and y coordinates can either be used for left or right, depending on modal 
    });
  }
  handleSecondModal(name = null, position = null, data = null) {
    this.setState({
      secondModal: { name, position, data }
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
      socket.emit('leave room', this.state.tasklist.id);

      this.setState({
        user: responses[0],
        tasklist: tasklist,
        tasks: responses[1],
        subjects: responses[2],
        categories: responses[3],
        currentTask: -1,
        subjectsFilter: responses[0].subjects,
        categoriesFilter: responses[0].categories,
        displayPastTasks: false
      });
      
      socket.emit('join room', tasklist.id);
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
   * @description Load past tasks 
   */
  handleLoadAllTasks() {
    fetch(`/app/tasks?full=true&tasklist=${this.state.tasklist.id}&all=true`, { 
      credentials: 'include' 
    })
    .then(response => response.json())
    .then(response => {
      this.setState({
        tasks: response,
        displayPastTasks: true
      });
    }).catch(err => {
      alert('There was an error while retrieving information. If this error persists, please contact SardonyxApp.');
      console.error(err);
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
      user_id: this.state.user.id,
      subject_id: obj.subject_id || null,
      category_id: obj.category_id || null
    };

    fetch(`/app/task?tasklist=${this.state.tasklist.id}`, {
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
        return {
          currentTask: response.insertId,
          tasks: [...prevState.tasks, Object.assign({
              id: response.insertId,
              user_name: prevState.user.name,
              subject_name: null, // TODO: initially set these according to task.subject_id 
              subject_color: null,
              category_name: null,
              category_color: null
            }, task)]
        };
      });
    
      socket.emit('tasks', this.state.tasklist.id);
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
    fetch(`/app/task?id=${obj.id}&tasklist=${this.state.tasklist.id}`, {
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
        return { tasks: prevState.tasks.map(t => t.id === obj.id ? {...t, ...obj} : t) };
      });

      socket.emit('tasks', this.state.tasklist.id);
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
    fetch(`/app/task?id=${id}&tasklist=${this.state.tasklist.id}`, {
      method: 'DELETE',
      credentials: 'include',
    }).then(() => {
      this.setState(prevState => {
        return {
          tasks: prevState.tasks.filter(t => t.id !== id),
          currentTask: -1
        };
      });

      socket.emit('tasks', this.state.tasklist.id);
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
    fetch(`/app/${type}?tasklist=${this.state.tasklist.id}`, {
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

      socket.emit('labels', type, this.state.tasklist.id);
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
   */
  handleUpdateLabel(type, obj) {
    fetch(`/app/${type}?id=${obj.id}&tasklist=${this.state.tasklist.id}`, {
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
        payload[type] = prevState[type].map(l => l.id === obj.id ? {...l, ...obj} : l);
        return payload;
      });

      socket.emit('labels', type, this.state.tasklist.id);
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
    fetch(`/app/${type}?id=${id}&tasklist=${this.state.tasklist.id}`, {
      method: 'DELETE',
      credentials: 'include'
    }).then(() => {
      this.setState(prevState => {
        const payload = {};
        payload[type] = prevState[type].filter(l => l.id !== id)
        return payload;
      });

      socket.emit('labels', type, this.state.tasklist.id);
    }).catch(err => {
      alert('There was an error while deleting a label. If this error persists, please contact SardonyxApp.');
      console.error(err);
    })
  }

  /**
   * @description Add or delete a user's default label
   * @param {String} type subject or category
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

  /**
   * @description Update default tasklist 
   * @param {Number} tasklistId 
   */
  handleChangeUserTasklist(tasklistId) {
    fetch(`/app/user/tasklist?id=${tasklistId}`, { 
      method: 'PATCH',
      credentials: 'include' 
    }).then(() => {
      this.setState(prevState => {
        return { user: {  ...prevState.user, tasklist_id: tasklistId } };
      });
    }).catch(err => {
      alert('There was an error while updating your default tasklist. If this error persists, please contact SardonyxApp.');
      console.error(err);
    });
  }

  render() {
    return (
      <div>
        <PrimaryModals 
          user={this.state.user}
          task={this.state.tasks.findById(this.state.currentTask)}
          tasklist={this.state.tasklist}
          tasklists={this.state.tasklists}
          subjects={this.state.subjects}
          categories={this.state.categories}
          subjectsFilter={this.state.subjectsFilter}
          categoriesFilter={this.state.categoriesFilter}

          onSelectTasklist={this.handleSelectTasklist}
          onFilter={this.handleFilter}
          onUpdateTask={this.handleUpdateTask}
          onCreateTask={this.handleCreateTask}
          onCreateLabel={this.handleCreateLabel}
          onUpdateLabel={this.handleUpdateLabel}
          onDeleteLabel={this.handleDeleteLabel}
          onUpdateUserLabel={this.handleUpdateUserLabel}
          onChangeUserTasklist={this.handleChangeUserTasklist}

          modal={this.state.modal}
          onModal={this.handleModal}
          onSecondModal={this.handleSecondModal}
        />
        <ModalBackground 
          modal={this.state.modal}
          onModal={this.handleModal}
          zIndex={2}
        />

        <SecondaryModals
          user={this.state.user} 
          subjects={this.state.subjects}
          categories={this.state.categories}

          onCreateLabel={this.handleCreateLabel}
          onUpdateLabel={this.handleUpdateLabel}
          onUpdateUserLabel={this.handleUpdateUserLabel}

          modal={this.state.secondModal}
          onModal={this.handleSecondModal}
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
            displayPastTasks={this.state.displayPastTasks}
            onModal={this.handleModal}
            onSelectTask={this.handleSelectTask}
            onFilter={this.handleFilter}
            onLoadAllTasks={this.handleLoadAllTasks}
          />
          <TaskInfo 
            task={this.state.tasks.findById(this.state.currentTask)}
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