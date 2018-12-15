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
 * @param {String} document 
 */
const loadDeadlines = (document) => {
  const $ = cheerio.load(document);
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

  return payload;
};

/**
 * @description Load class list 
 * @param {String} document
 */
const loadClasses = (document) => {
  const $ = cheerio.load(document);
  const payload = [];

  $('#menu > .nav-menu > li.parent:nth-child(6) li').each((i, el) => {
    payload.push({
      title: encodeURI($(el).find('a').text().replace(/\n/g, '')),
      link: $(el).find('a').attr('href')
    });
  });

  return payload;
};

/**
 * @description Load group list  
 * @param {String} document
 */
const loadGroups = (document) => {
  const $ = cheerio.load(document);
  const payload = [];

  $('#menu > .nav-menu > li.parent:nth-child(10) li').each((i, el) => {
    payload.push({
      title: encodeURI($(el).find('a').text().replace(/\n/g, '')),
      link: $(el).find('a').attr('href')
    });
  });

  return payload;
};

/** 
 * @description Load notification count
 * @param {String} document 
 */
const loadNotificationCount = (document) => {
  const $ = cheerio.load(document);
  
  return $('.notifications-count').data('count');
};

/**
 * @description Load dashboard
 * @param {Object} req
 * @param {Object} res 
 * @param {Function} next 
 */
exports.loadDefaults = (req, res, next) => {
  res.append('Managebac-Data', JSON.stringify({
    deadlines: loadDeadlines(req.document),
    classes: loadClasses(req.document),
    groups: loadGroups(req.document),
    notificationCount: loadNotificationCount(req.document)
  }));

  next();
};