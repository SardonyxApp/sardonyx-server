/**
 * @fileoverview Interacts with the tasklists table of the database. 
 * @author SardonyxApp
 * @license MIT 
 */

const db = require('../db');

/**
 * @description Select tasklist by id 
 * @param {Number} id 
 * @returns {Promise}
 */
exports.select = id => {
  return new Promise((resolve, reject) => {
    db.get().query(`SELECT * FROM tasklists WHERE id = ?`, id, (err, results) => {
      if (err) reject(err); 
      resolve(results);
    });
  });
};

/**
 * @description Select all tasklists 
 * @returns {Promise}
 */
exports.selectAll = () => {
  return new Promise((resolve, reject) => {
    db.get().query(`SELECT * FROM tasklists`, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
}