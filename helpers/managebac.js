/**
 * @fileoverview Helper functions used in authentication.
 * @author SardonyxApp
 * @license MIT
 */

 const request = require('request');
 const cheerio = require('cheerio');

 /**
  * @description Loads upcoming deadlines
  * @param {Object} req
  * req must have document
  * @param {Object} res
  * @param {Function} next
  */
 exports.loadDeadlines = (req, res, next) => {
   const $ = cheerio.load(req.document);
   next();
 };