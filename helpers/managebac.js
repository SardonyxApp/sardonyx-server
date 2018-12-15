/**
 * @fileoverview Helper functions used in authentication.
 * @author SardonyxApp
 * @license MIT
 */

const request = require('request');
const cheerio = require('cheerio');
const { getMonth, guessYear } = require('./helpers');

/**
 * @description Loads upcoming deadlines
 * @param {Object} req
 * req must have document
 * @param {Object} res
 * @param {Function} next
 */
exports.loadDeadlines = (req, res, next) => {
  const $ = cheerio.load(req.document);

  const payload = [];
  $('.agenda > .line').each((i, el) => {
    const labels = [];
    $(el).find('.label').each((i, label) => {
      labels.push($(label).text().replace(/\n/g, '')); 
    });

    const due = $(el).find('.due').text();
    const dueMinute = Number(due.match(/\d{2}(?!:\d{1,2})/)[0]);
    const dueHour = due.match(/[APM]{2}$/) === 'AM' ? Number(due.match(/\d{1,2}(?=:\d{1,2})/)[0]) : Number(due.match(/\d{1,2}(?=:\d{1,2})/)[0]) + 12;
    const dueMonth = getMonth($(el).find('.month').text());

    payload.push({
      title: encodeURI($(el).find('.title a').text()), 
      link: $(el).find('.title a').attr('href'),
      labels: labels,
      deadline: $(el).find('.due').hasClass('deadline'), // Boolean
      due: new Date(guessYear(dueMonth), dueMonth, $(el).find('.day').text(), dueHour, dueMinute),
      author: $(el).find('.author').attr('title'),
      avatar: $(el).find('.avatar').attr('src') || false
    });
  });

  req.deadlines = payload;
  next();
};

/**
 * @description Encode data into header 
 * @param {Object} req
 * @param {Object} res 
 * @param {Function} next 
 */
exports.encode = (req, res, next) => {
  const payload = {};
  if (req.hasOwnProperty('deadlines')) payload.deadlines = req.deadlines;
  // Add more as we load new things 
  // ...
  res.append('Managebac-Data', JSON.stringify(payload));
  next();
};