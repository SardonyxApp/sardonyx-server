/**
 * @fileoverview Interact with the teachers table of the database.
 * @author SardonyxApp
 * @license MIT 
 */

 const db = require('../db');
 const { hashPassword } = require('../helpers/helpers');

/**
 * @description Select a teacher by email 
 * @param {String} email 
 * @returns {Promise} results 
 */
exports.selectByEmail = email => {
  return new Promise((resolve, reject) => {
    db.get().query("SELECT * FROM teachers WHERE email = ?", email, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

/**
 * @description Update a teacher's password 
 * @param {String} email 
 * @param {String} password 
 * @returns {Promise}
 */
exports.updatePassword = (email, password) => { // Not tested 
  return new Promise((resolve, reject) => {
    const obj = hashPassword(password);
    db.get().query("UPDATE teachers SET ? WHERE email = ?", [obj, email], (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};