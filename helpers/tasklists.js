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
      results.forEach(task => {
        // Some values have to be decoded for now 
        for (t of Object.keys(task)) {
          if (typeof task.t === 'string') task.t = decodeURIComponent(task.t);
        }
        return task;
      });
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
 * @description Load subject labels 
 * @param {Object} req 
 * @param {Object} res 
 */
exports.loadSubjects = (req, res) => {
  subjects.selectByTasklistId(req.token.year - 2017).then(results => {
    res.json(results);
  }).catch(err => {
    console.error(err);
    res.status(500).send('There was an error while accessing the database. ' + err);
  });
}

/**
 * @description Load category labels 
 * @param {Object} req 
 * @param {Object} res 
 */
exports.loadCategories = (req, res) => {
  categories.selectByTasklistId(req.token.year - 2017).then(results => {
    res.json(results);
  }).catch(err => {
    console.error(err);
    res.status(500).send('There was an error while accessing the database. ' + err);
  });
}