/**
 * @fileoverview Interact with the students table of the database.
 * @author SardonyxApp
 * @license MIT 
 */

const db = require('../db');

/**
 * @description Select a student by email 
 * @param {String} email 
 * @returns {Promise} results 
 */
exports.selectByEmail = email => {
  return new Promise((resolve, reject) => {
    db.get().query("SELECT * FROM students WHERE email = ?", email, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

/**
 * @description Create a student 
 * @param {Array} params 
 * name, email, year, tasklist_id are required
 * @returns {Promise} rows 
 */
exports.create = params => {
  return new Promise((resolve, reject) => {
    db.get().query("INSERT INTO students (name, email, year, tasklist_id) VALUES (?, ?, ?, ?)", params, (err, rows) => {
      if (err) console.error(err);
      resolve(rows);
    });
  });  
};