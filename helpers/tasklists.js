/**
 * @fileoverview Helper functions used to manage tasklists.
 * @author SardonyxApp
 * @license MIT 
 */

const students = require('../models/students');
const teachers = require('../models/teachers');
const tasklists = require('../models/tasklists');

/**
 * @description Load user information 
 * @param {Object} req
 * @param {Object} res 
 * @param {Function} next
 */
exports.loadUser = (req, res, next) => {
  const target = req.token.teacher ? teachers : students; 
  target.selectByEmail(req.token.email).then(results => {
    if (!results.length) res.status(500).send('Invalid user requested.');
    // For teachers 
    delete results[0].password_digest;
    delete results[0].salt;
    
    res.append('Sardonyx-User', JSON.stringify(results[0]));
    next();
  });
};

/**
 * @description Load tasklist 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 */
exports.loadTasklist = (req, res, next) => {
  tasklists.select(req.token.year - 2017).then(results => {
    if (!results.length) res.status(500).sned('Invalid tasklist requested.');
    res.append('Sardonyx-Tasklist', JSON.stringify(results[0]));
    next();
  });
};