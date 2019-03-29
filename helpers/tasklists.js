/**
 * @fileoverview Helper functions used to manage tasklists.
 * @author SardonyxApp
 * @license MIT 
 */

const { students, teachers } = require('../models/users');
const tasklists = require('../models/tasklists');
const tasks = require('../models/tasks');
const { subjects, categories } = require('../models/labels');

/**
 * @description Load user information 
 * @param {Object} req
 * @param {Object} res 
 */
exports.loadUser = (req, res) => {
  const target = req.token.teacher ? teachers : students; 
  Promise.all([
    target.selectByEmail(req.token.email),
    target.selectLabels(req.token.id, req.token.tasklist)
  ]).then(results => {
    const user = results[0][0];
    if (!results[0].length) res.status(400).send('Invalid user requested.');
    
    // For teachers
    delete user.password_digest;
    delete user.salt;

    user.teacher = req.token.teacher;
    user.subjects = [];
    user.categories = [];

    results[1].forEach(obj => {
      if (obj.subject_id) user.subjects.push(obj.subject_id);
      if (obj.category_id) user.categories.push(obj.category_id);
    });
    
    res.json(user);
  }).catch(err => {
    console.error(err);
    res.status(500).send('There was an error while accessing the database. ' + err);
  });
};

/**
 * @description Add or delete user's default labels 
 * @param {String} type subjects or categories 
 * @param {String} action add or delete 
 */
exports.changeUserLabel = (type, action) => {
  return (req, res) => {
    const target = req.token.teacher ? teachers : students;
    const operation = action === 'add' ? target.addLabel : target.deleteLabel;
    operation.call(target, req.token.id, req.query.id, type).then(results => {
      res.json(results);
    }).catch(err => {
      console.error(err);
      res.status(500).send('There was an error while accessing the database. ' + err);
    });
  };
};

/**
 * @description Update a teacher's default tasklist 
 * @param {Object} req 
 * @param {Object} res 
 */
exports.changeTeacherTasklist = (req, res) => {
  teacher.updateTasklist(req.token.id, req.token.tasklist).then(results => {
    res.json(results);
  }).catch(err => {
    console.error(err);
    res.status(500).send('There was an error while accessing the database. ' + err);
  });
};

/**
 * @description Load tasklist 
 * @param {Object} req 
 * @param {Object} res 
 */
exports.loadTasklist = (req, res) => {
  // Select all
  if (req.token.tasklist === 'all') {
    tasklists.selectAll().then(results => {
      res.json(results);
    }).catch(err => {
      console.error(err);
      res.status(500).send('There was an error while accessing the database. ' + err);
    });
  } else {
    // Select by tasklist_id  
    tasklists.select(req.token.tasklist).then(results => {
      if (!results.length) res.status(400).send('Invalid tasklist requested.');
      res.json(results[0]);
    }).catch(err => {
      console.error(err);
      res.status(500).send('There was an error while accessing the database. ' + err);
    });
  }
};

/**
 * @description Load tasks 
 * @param {Object} req 
 * @param {Object} res 
 */
exports.loadTasks = (req, res) => {
  if (req.query.full = 'true') {
    tasks.selectJoinedByTasklistId(req.token.tasklist).then(results => {
      res.json(results);
    }).catch(err => {
      console.error(err);
      res.status(500).send('There was an error while accessing the database. ' + err);
    });
  } else {
    tasks.selectByTasklistId(req.token.tasklist).then(results => {
      res.json(results);
    }).catch(err => {
      console.error(err);
      res.status(500).send('There was an error while accessing the database. ' + err);
    });
  }
};

/**
 * @description Process task 
 * @param {Object} req
 * @param {Object} res 
 * @param {FUnction} next
 */
exports.craftTask = (req, res, next) => {
  if (req.body.due) { // Skips when req.body.due === null or undefined 
    // Shift the time by timezone offset since the ISO string is in UTC
    req.body.due = new Date(req.body.due);
  }

  next();
}

/**
 * @description Create task 
 * @param {Object} req
 * @param {Object} res 
 */
exports.createTask = (req, res) => {
  tasks.create(req.body).then(results => {
    res.json(results);
  }).catch(err => {
    console.error(err);
    res.status(500).send('There was an error while accessing the database. ' + err);
  });
}

/**
 * @description Edit a task by its id 
 * @param {Object} req 
 * @param {Object} res 
 */
exports.editTask = (req, res) => {
  tasks.update(Number(req.query.id), req.body).then(results => {
    res.json(results);
  }).catch(err => {
    console.error(err);
    res.status(500).send('There was an error while accessing the database. ' + err);
  });
}

/**
 * @description Delete a task by its id 
 * @param {Object} req 
 * @param {Object} res 
 */
exports.deleteTask = (req, res) => {
  tasks.delete(Number(req.query.id)).then(results => {
    res.json(results);
  }).catch(err => {
    console.error(err);
    res.status(500).send('There was an error while accessing the database. ' + err);
  });
}

/**
 * @description Load labels 
 * @param {String} type subjects or categories 
 * @returns {Function} express middleware 
 */
exports.loadLabel = type => {
  const target = type === 'subjects' ? subjects : categories;
  return (req, res) => {
    target.selectByTasklistId(req.token.tasklist).then(results => {
      res.json(results);
    }).catch(err => {
      console.error(err);
      res.status(500).send('There was an error while accessing the database. ' + err);
    });
  };  
};

/**
 * @description Create a label 
 * @param {String} type subjects or categories 
 * @returns {Function} express middleware 
 */
exports.createLabel = type => {
  return (req, res) => {
    const target = type === 'subjects' ? subjects : categories;
    target.create(req.body).then(results => {
      res.json(results);
    }).catch(err => {
      console.error(err);
      res.status(500).send('There was an error while accessing the database. ' + err);
    });
  };  
};

/**
 * @description Update a label 
 * @param {String} type subjects or categories 
 * @returns {Function} express middleware 
 */
exports.updateLabel = type => {
  return (req, res) => {
    const target = type === 'subjects' ? subjects : categories;
    target.update(req.query.id, req.body).then(results => {
      res.json(results);
    }).catch(err => {
      console.error(err);
      res.status(500).send('There was an error while accessing the database. ' + err);
    });
  };
};

/**
 * @description Delete a label 
 * @param {String} type subjects or categories 
 * @returns {Function} express middleware 
 */
exports.deleteLabel = type => {
  return (req, res) => {
    const target = type === 'subjects' ? subjects : categories;
    target.delete(req.query.id).then(results => {
      res.json(results);
    }).catch(err => {
      console.error(err);
      res.status(500).send('There was an error while accessing the database. ' + err);
    });
  };
};