/**
 * @fileoverview Helper functions used in authentication.
 * @author SardonyxApp
 * @license MIT
 */

 const request = require('request');

 /**
  * @description Loads upcoming deadlines
  * @param {Object} req
  * req must have document
  * @param {Object} res
  * @param {Function} next
  */
 exports.loadDeadlines = (req, res, next) => {
   next();
 };