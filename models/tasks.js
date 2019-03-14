/**
 * @fileoverview Interact with the tasks table in the database.
 * @author SardonyxApp
 * @license MIT 
 */

const db = require('../db');

/**
 * @description Select all tasks by tasklist id 
 * @param {Number} tasklistId 
 * @returns {Promise}
 */
exports.selectByTasklistId = tasklistId => {
  return new Promise((resolve, reject) => {
    db.get().query(`SELECT * FROM tasks WHERE tasklist_id = ?`, tasklistId, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};