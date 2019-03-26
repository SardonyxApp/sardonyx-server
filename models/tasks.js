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

/**
 * @description Select all tasks joined by relevant foreign tables by tasklist id
 * @param {Number} tasklistId 
 * @returns {Promise}
 */
exports.selectJoinedByTasklistId = tasklistId => {
  return new Promise((resolve, reject) => {
    db.get().query(`SELECT tasks.id, tasks.name, tasks.description, tasks.due, tasks.tasklist_id, tasks.subject_id, subjects.name AS subject_name, subjects.color AS subject_color, tasks.category_id, categories.name AS category_name, categories.color AS category_color, tasks.student_id, students.name AS student_name, tasks.teacher_id, teachers.name AS teacher_name FROM tasks LEFT JOIN subjects ON subject_id LEFT JOIN categories ON category_id LEFT JOIN students ON student_id LEFT JOIN teachers ON teacher_id WHERE (tasks.subject_id = subjects.id OR tasks.subject_id IS NULL) AND (tasks.category_id = categories.id OR tasks.category_id IS NULL) AND (tasks.student_id = students.id OR tasks.student_id IS NULL) AND (tasks.teacher_id = teachers.id OR tasks.teacher_id IS NULL) AND tasks.tasklist_id = ? ORDER BY due ASC;`, tasklistId, (err, results) => {
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
    // Preparing statements to avoid SQL injection vulnerability
    const arr = [];
    for (i in Object.keys(task)) {
      arr.push('?')
    }

    db.get().query(`INSERT INTO tasks (${arr.join(', ')}) VALUES (${arr.join(', ')})`, [...Object.keys(task), ...Object.values(task)], (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
}

/**
 * @description Edit a task by id
 * @param {Number} id 
 * @param {Object} task 
 * @returns {Promise}
 */
exports.update = (id, task) => {  
  return new Promise((resolve, reject) => {
    db.get().query("UPDATE tasks SET ? WHERE id = ?", [task, id], (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
}