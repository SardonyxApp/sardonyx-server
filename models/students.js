/**
 * @fileoverview Interact with the students table of the database.
 * @author SardonyxApp
 * @license MIT 
 */

const db = require('../db');

/**
 * @description Select a student by email 
 * @param {String} email 
 * @param {Function} callback 
 */
exports.selectByEmail = (email, callback) => {
  db.get().query("SELECT * FROM students WHERE email = ?", email, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

/**
 * @description Create a student 
 * @param {Array} params 
 * All fields (id, first_name, last_name, email, year, tasklist_id) are required
 * @param {Function} callback 
 */
exports.create = (params, callback) => {
  db.get().query("INSERT INTO students (id, first_name, last_name, email, year, tasklist_id) VALUES (?, ?, ?, ?, ?, ?"), params, (err, rows) => {
    if (err) return callback(err);
    callback(null, rows);
  }
};