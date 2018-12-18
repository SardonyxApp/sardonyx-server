/**
 * @fileoverview Helper functions used in authentication.
 * @author SardonyxApp
 * @license MIT
 */

const request = require('request');
const cheerio = require('cheerio');
const { getMonth, guessFutureYear, guessPastYear } = require('./helpers');

/**
 * @description Loads upcoming deadlines
 * @param {String} document 
 * @returns {Array}
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
    const dueMinute = Number(due.match(/\d{2}(?= [AP]M)/)[0]);
    const dueHour = due.match(/[APM]{2}$/) === 'AM' ? Number(due.match(/\d{1,2}(?=:\d{2})/)[0]) : Number(due.match(/\d{1,2}(?=:\d{2})/)[0]) + 12;
    const dueMonth = getMonth($(el).find('.month').text());
    const dueYear = $(el).parent().prev('h3').text().includes('Upcoming') ? guessFutureYear(dueMonth) : guessPastYear(dueMonth);

    payload.push({
      title: encodeURI($(el).find('.title a').text()), 
      link: $(el).find('.title a').attr('href'),
      labels: labels,
      deadline: $(el).find('.due').hasClass('deadline'), // Boolean
      due: new Date(dueYear, dueMonth, $(el).find('.day').text(), dueHour, dueMinute),
      author: $(el).find('.author').attr('title'),
      avatar: $(el).find('.avatar').attr('src') || false
    });
  });

  return payload;
};

/**
 * @description Load class messages 
 * @param {String} document 
 * @returns {Array}
 */
const loadDiscussions = (document) => {
  const $ = cheerio.load(document);
  const payload = [];

  const setDate = el => {
    const date = $(el).find('.header').text();
    const minute = Number(date.match(/\d{2}(?= [AP]M)/));
    const hour = date.match(/[APM]{2}/) === "AM" ? Number(date.match(/\d{1,2}(?=:\d{2})/)) : Number(date.match(/\d{1,2}(?=:\d{2})/)) + 12;
    const day = Number(date.match(/\d{1,2}(?=, \d{4})/));
    const month = getMonth(date.match(/\w{3}(?= {1,2}\d)/)[0]);
    const year = Number(date.match(/\d{4}(?= at )/));
    return new Date(year, month, day, hour, minute);
  }

  $('.discussion').each((i, el) => {
    const comments = [];
    $(el).find('.reply').each((i, elem) => {
      comments.push({
        title: encodeURI($(elem).find('h4.title').text()),
        content: $(elem).find('.body .fix-body-margins').html(), // This is potentially dangerous, XSS
        author: $(elem).find('.header strong').text(),
        avatar: $(elem).find('.avatar').attr('src') || false, 
        date: setDate(elem)
      });
    });

    payload.push({
      title: encodeURI($(el).find('.discussion-content h4.title').text()),
      link: $(el).find('.discussion-content h4.title a').attr('href'),
      content: $(el).find('.discussion-content .fix-body-margins').html(), // This is potentially dangerous, XSS
      author: $(el).find('.discussion-content .header strong').text(),
      avatar: $(el).find('.discussion-content .avatar').attr('src') || false,
      date: setDate(el),
      comments: comments
    });
  });

  return payload;
};

/**
 * @description Load class list 
 * @param {String} document
 * @returns {Array}
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
 * @returns {Array}
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
 * @returns {Number}
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

/**
 * @description Load class/group overview
 * @param {Object} req 
 * req must have a document property 
 * @param {Object} res 
 * @param {Function} next 
 */
exports.loadOverview = (req, res, next) => {
  res.append('Managebac-Data', JSON.stringify({
    deadlines: loadDeadlines(req.document)
  }));

  next();
};

/**
 * @description Load class assignment list 
 * @param {Object} req 
 * req must have a document property 
 * @param {Object} res 
 * @param {Function} next 
 */
exports.loadAssignments = (req, res, next) => {
  const arr = loadDeadlines(req.document);
  res.append('Managebac-Data', JSON.stringify({
    upcoming: arr.filter(val => val.due.getTime() >= new Date().getTime()),
    completed: arr.filter(val => val.due.getTime() < new Date().getTime())
  }));

  next();
};


/**
 * @description Load class/group messages 
 * @param {Object} req 
 * req must have a document property 
 * @param {Object} res 
 * @param {Function} next 
 */
exports.loadMessages = (req, res, next) => {
  res.append('Managebac-Data', JSON.stringify({
    messages: loadDiscussions(req.document)
  }));

  next();
};

/**
 * @description Load single message
 * @param {Object} req
 * req must have a document property 
 * @param {Object} res 
 * @param {Function} next 
 */
exports.loadMessage = (req, res, next) => {
  res.append('Managebac-Data', JSON.stringify({
    message: loadDiscussions(req.document)
  }));

  next();
};