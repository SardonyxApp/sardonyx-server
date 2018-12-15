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
 * req must have document property
 * @param {Object} res
 * @param {Function} next
 */
exports.loadDeadlines = (req, res, next) => {
  const $ = cheerio.load(req.document);
  req.deadlines = [];

  $('.agenda > .line').each((i, el) => {
    const labels = [];
    $(el).find('.label').each((i, label) => {
      labels.push($(label).text().replace(/\n/g, '')); 
    });

    const due = $(el).find('.due').text();
    const dueMinute = Number(due.match(/\d{2}(?!:\d{1,2})/)[0]);
    const dueHour = due.match(/[APM]{2}$/) === 'AM' ? Number(due.match(/\d{1,2}(?=:\d{1,2})/)[0]) : Number(due.match(/\d{1,2}(?=:\d{1,2})/)[0]) + 12;
    const dueMonth = getMonth($(el).find('.month').text());

    req.deadlines.push({
      title: encodeURI($(el).find('.title a').text()), 
      link: $(el).find('.title a').attr('href'),
      labels: labels,
      deadline: $(el).find('.due').hasClass('deadline'), // Boolean
      due: new Date(guessYear(dueMonth), dueMonth, $(el).find('.day').text(), dueHour, dueMinute),
      author: $(el).find('.author').attr('title'),
      avatar: $(el).find('.avatar').attr('src') || false
    });
  });

  next();
};

/**
 * @description Load class list 
 * @param {Object} req
 * req must have document property
 * @param {Object} res 
 * @param {Function} next 
 */
exports.loadClasses = (req, res, next) => {
  const $ = cheerio.load(req.document);
  req.classes = [];

  $('#menu > .nav-menu > li.parent:nth-child(6) li').each((i, el) => {
    req.classes.push({
      title: encodeURI($(el).find('a').text().replace(/\n/g, '')),
      link: $(el).find('a').attr('href')
    });
  });

  next();
};

/**
 * @description Load group list 
 * @param {Object} req
 * req must have document property
 * @param {Object} res 
 * @param {Function} next 
 */
exports.loadGroups = (req, res, next) => {
  const $ = cheerio.load(req.document);
  req.groups = [];

  $('#menu > .nav-menu > li.parent:nth-child(10) li').each((i, el) => {
    req.groups.push({
      title: encodeURI($(el).find('a').text().replace(/\n/g, '')),
      link: $(el).find('a').attr('href')
    });
  });

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
  if (req.hasOwnProperty('classes')) payload.classes = req.classes;
  if (req.hasOwnProperty('groups')) payload.groups = req.groups;
  
  res.append('Managebac-Data', JSON.stringify(payload));
  next();
};