/**
 * @fileoverview Interact with the users table of the database.
 * @author SardonyxApp
 * @license MIT 
 */

const db = require('../db');
const bcrypt = require('bcrypt');

class User {
  constructor() {
    this.target = 'users';
    this.idName = 'user_id';
  }

  /**
   * @description Select a user by email 
   * @param {String} email 
   * @returns {Promise} results 
   */
  selectByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get().query("SELECT * FROM ?? WHERE email = ?", [this.target, email], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  }

  /**
   * @description Retrieve default labels for user
   * @param {Number} id 
   * @param {Number} tasklist_id 
   * @returns {Promise} results
   */
  selectLabels(id, tasklist_id) {
    return new Promise((resolve, reject) => {
      db.get().query("SELECT subject_id, category_id FROM user_labels LEFT JOIN subjects ON user_labels.subject_id = subjects.id LEFT JOIN categories ON user_labels.category_id = categories.id WHERE ?? = ? AND (subjects.tasklist_id = ? OR categories.tasklist_id = ?)", [this.idName, id, tasklist_id, tasklist_id], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  }

  /**
   * @description Add a default label for user 
   * @param {Number} id user 
   * @param {Number} label_id 
   * @param {Number} type subjects or categories 
   * @returns {Promise} results
   */
  addLabel(id, label_id, type) {
    return new Promise((resolve, reject) => {
      const obj = {};
      obj[this.idName] = id;
      const labelName = type === 'subjects' ? 'subject_id' : 'category_id';
      obj[labelName] = label_id;

      db.get().query("INSERT INTO user_labels SET ?", obj, (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  }

  /**
   * @description Delete a default label for user 
   * @param {Number} id user 
   * @param {Number} label_id 
   * @param {Number} type subjects or categories 
   * @returns {Promise} results
   */
  deleteLabel(id, label_id, type) {
    return new Promise((resolve, reject) => {
      const labelName = type === 'subjects' ? 'subject_id' : 'category_id';
      db.get().query("DELETE FROM user_labels WHERE ?? = ? AND ?? = ?", [this.idName, id, labelName, label_id], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  }

  /**
   * @description Update password 
   * @param {String} email 
   * @param {String} password 
   * @returns {Promise} results
   */
  updatePassword(email, password) { 
    return new Promise(async (resolve, reject) => {
      const password_digest = await bcrypt.hash(password, 12);
      db.get().query("UPDATE users SET ? WHERE email = ?", [{ password_digest }, email], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  };

  /**
   * @description Update default tasklist 
   * @param {Number} id 
   * @param {Number} tasklist_id
   * @returns {Promise} results
   */
  updateTasklist(id, tasklistId) {
    return new Promise((resolve, reject) => {
      db.get().query("UPDATE users SET tasklist_id = ? WHERE id = ?", [tasklistId, id], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  };
}

const users = new User();

module.exports = { users };