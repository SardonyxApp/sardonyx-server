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
    db.get().query("SELECT * FROM tasks WHERE tasklist_id = ?", tasklistId, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

/**
 * @description Select all tasks joined by relevant foreign tables by tasklist id
 * @param {Number} tasklistId 
 * @returns {Promise}
 */
exports.selectJoinedByTasklistId = tasklistId => {
  return new Promise((resolve, reject) => {
    db.get().query("SELECT tasks.id, tasks.name, tasks.description, tasks.due, tasks.tasklist_id, tasks.subject_id, subjects.name AS subject_name, subjects.color AS subject_color, tasks.category_id, categories.name AS category_name, categories.color AS category_color, tasks.user_id, users.name AS user_name FROM tasks LEFT JOIN subjects ON subject_id LEFT JOIN categories ON category_id LEFT JOIN users ON user_id WHERE (tasks.subject_id = subjects.id OR tasks.subject_id IS NULL) AND (tasks.category_id = categories.id OR tasks.category_id IS NULL) AND (tasks.user_id = users.id OR tasks.user_id IS NULL) AND tasks.tasklist_id = ? ORDER BY due ASC;", tasklistId, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

/**
 * @description Select all tasks with due dates in the future 
 * @param tasklistId 
 * @returns {Promise}
 */
exports.selectFutureByTasklistId = tasklistId => {
  return new Promise((resolve, reject) => {
    db.get().query("SELECT * FROM tasks WHERE (due >= CURRENT_DATE() OR due IS NULL) AND tasklist_id = ?", tasklistId, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

/**
 * @description Select all tasks joined by relevant foreign tables by tasklist id 
 * @param {Number} tasklistId 
 * @returns {Promise}
 */
exports.selectFutureJoinedByTasklistId = tasklistId => {
  return new Promise((resolve, reject) => {
    db.get().query("SELECT tasks.id, tasks.name, tasks.description, tasks.due, tasks.tasklist_id, tasks.subject_id, subjects.name AS subject_name, subjects.color AS subject_color, tasks.category_id, categories.name AS category_name, categories.color AS category_color, tasks.user_id, users.name AS user_name FROM tasks LEFT JOIN subjects ON subject_id LEFT JOIN categories ON category_id LEFT JOIN users ON user_id WHERE (tasks.subject_id = subjects.id OR tasks.subject_id IS NULL) AND (tasks.category_id = categories.id OR tasks.category_id IS NULL) AND (tasks.user_id = users.id OR tasks.user_id IS NULL) AND (tasks.due >= CURRENT_DATE() OR tasks.due IS NULL) AND tasks.tasklist_id = ? ORDER BY due ASC;", tasklistId, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

/**
 * @description Create a new task 
 * @param {Object} task 
 * @returns {Promise}
 */
exports.create = task => {
  return new Promise((resolve, reject) => {
    db.get().query("INSERT INTO tasks SET ?", task, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
}

/**
 * @description Edit a task by id
 * @param {Number} id 
 * @param {Number} tasklistId permitted tasklist 
 * @param {Object} task 
 * @returns {Promise}
 */
exports.update = (id, tasklistId, task) => {  
  return new Promise((resolve, reject) => {
    db.get().query("UPDATE tasks SET ? WHERE id = ? AND tasklist_id = ?", [task, id, tasklistId], (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
}

/**
 * @description Delete a task by id 
 * @param {Number} id
 * @param {Number} tasklistId permitted tasklist 
 * @returns {Promise} 
 */
exports.delete = (id, tasklistId) => {
  return new Promise((resolve, reject) => {
    db.get().query("DELETE FROM tasks WHERE id = ? AND tasklist_id = ?", [id, tasklistId], (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
}