/**
 * @fileoverview Helper functions used to manage tasklists.
 * @author SardonyxApp
 * @license MIT 
 */

const students = require('../models/students');
const teachers = require('../models/teachers');
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
  target.selectByEmail(req.token.email).then(results => {
    if (!results.length) res.status(400).send('Invalid user requested.');
    // For teachers 
    delete results[0].password_digest;
    delete results[0].salt;

    results[0].teacher = req.token.teacher;
    
    res.json(results[0]);
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
  if (req.token.year === 'all') {
    tasklists.selectAll().then(results => {
      res.json(results);
    }).catch(err => {
      console.error(err);
      res.status(500).send('There was an error while accessing the database. ' + err);
    });
  } else {
    // Select by year 
    tasklists.select(req.token.year - 2017).then(results => {
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
    tasks.selectJoinedByTasklistId(req.token.year - 2017).then(results => {
      res.json(results);
    }).catch(err => {
      console.error(err);
      res.status(500).send('There was an error while accessing the database. ' + err);
    });
  } else {
    tasks.selectByTasklistId(req.token.year - 2017).then(results => {
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
    target.selectByTasklistId(req.token.year - 2017).then(results => {
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