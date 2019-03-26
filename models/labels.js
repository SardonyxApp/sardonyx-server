/**
 * @fileoverview Interact with the subjects and the categories table in the database.
 * @author SardonyxApp
 * @license MIT 
 */

const db = require('../db');

class Labels {
  /**
   * @param {String} target Name of the table 
   */
  constructor(target) {
    this.target = target;
  }

  /**
   * @description Select all labels by tasklist id 
   * @param {Number} tasklistId 
   * @returns {Promise}
   */
  selectByTasklistId(tasklistId) {
    return new Promise((resolve, reject) => {
      db.get().query("SELECT * FROM ?? WHERE tasklist_id = ?", [this.target, tasklistId], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  }
}

const subjects = new Labels('subjects');
const categories = new Labels('categories');

module.exports = { subjects, categories };