/**
 * @fileoverview Helper functions used to manage tasklists.
 * @author SardonyxApp
 * @license MIT 
 */

const students = require('../models/students');
const teachers = require('../models/teachers');
const tasklists = require('../models/tasklists');
const tasks = require('../models/tasks');

/**
 * @description Load user information 
 * @param {Object} req
 * @param {Object} res 
 */
exports.loadUser = (req, res) => {
  const target = req.token.teacher ? teachers : students; 
  target.selectByEmail(req.token.email).then(results => {
    if (!results.length) res.status(500).send('Invalid user requested.');
    // For teachers 
    delete results[0].password_digest;
    delete results[0].salt;

    res.json(results[0]);
  });
};

/**
 * @description Load tasklist 
 * @param {Object} req 
 * @param {Object} res 
 */
exports.loadTasklist = (req, res) => {
  tasklists.select(req.token.year - 2017).then(results => {
    if (!results.length) res.status(500).sned('Invalid tasklist requested.');
    res.json(results[0]);
  });
};

/**
 * @description Load tasks 
 * @param {Object} req 
 * @param {Object} res 
 */
exports.loadTasks = (req, res) => {
  tasks.selectByTasklistId(req.token.year - 2017).then(results => {
    res.json(results);
  });
};