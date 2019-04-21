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
    db.get().query("SELECT tasks.id, tasks.name, tasks.description, tasks.due, tasks.tasklist_id, tasks.subject_id, subjects.name AS subject_name, subjects.color AS subject_color, tasks.category_id, categories.name AS category_name, categories.color AS category_color, tasks.student_id, students.name AS student_name, tasks.teacher_id, teachers.name AS teacher_name, tasks.managebac FROM tasks LEFT JOIN subjects ON subject_id LEFT JOIN categories ON category_id LEFT JOIN students ON student_id LEFT JOIN teachers ON teacher_id WHERE (tasks.subject_id = subjects.id OR tasks.subject_id IS NULL) AND (tasks.category_id = categories.id OR tasks.category_id IS NULL) AND (tasks.student_id = students.id OR tasks.student_id IS NULL) AND (tasks.teacher_id = teachers.id OR tasks.teacher_id IS NULL) AND tasks.tasklist_id = ? ORDER BY due ASC;", tasklistId, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

/**
 * @description Select all tasks with due dates in the future 
 * @returns {Promise}
 */
exports.selectAllFuture = () => {
  return new Promise((resolve, reject) => {
    db.get().query("SELECT * FROM tasks WHERE due >= CURRENT_DATE()", (err, results) => {
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