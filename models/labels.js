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

  /**
   * @decription Create a new task 
   * @param {Object} task 
   * @returns {Promise}
   */
  create(task) {
    return new Promise((resolve, reject) => {
      db.get().query("INSERT INTO ?? SET ?", [this.target, task], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  }

  /**
   * @description Update a task 
   * @param {Number} id
   * @param {Object} task 
   * @returns {Promise}
   */
  update(id, task) {
    return new Promise((resolve, reject) => {
      db.get().query("UPDATE ?? SET ? WHERE id = ?", [this.target, task, id], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  }

  /**
   * @description Delete a task 
   * @param {Number} id 
   * @returns {Promise}
   */
  delete(id) {
    return new Promise((resolve, reject) => {
      db.get().query("DELETE FROM ?? WHERE id = ?", [this.target, id], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  }
}

const subjects = new Labels('subjects');
const categories = new Labels('categories');

module.exports = { subjects, categories };