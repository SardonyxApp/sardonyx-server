/**
 * @fileoverview Helper functions used in authentication.
 * @author SardonyxApp
 * @license MIT
 */


 const cheerio = require('cheerio');
const { getMonthFromAbbr, getMonth, guessFutureYear, guessPastYear, createDate } = require('./helpers');

/**
 * @description Retrieve upcoming deadlines from document
 * @param {String} document 
 * @returns {Array}
 */
const retrieveDeadlines = document => {
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
    const dueMonth = getMonthFromAbbr($(el).find('.month').text());
    const dueYear = $(el).parent().prev('h3').text().includes('Upcoming') ? guessFutureYear(dueMonth) : guessPastYear(dueMonth);

    payload.push({
      title: encodeURI($(el).find('h4.title').text()), 
      link: $(el).find('.title a').attr('href') || false,
      labels: labels,
      deadline: $(el).find('.due').hasClass('deadline'), // Boolean
      due: new Date(dueYear, dueMonth, $(el).find('.day').text(), dueHour, dueMinute),
      author: $(el).find('.author').attr('title') || false,
      avatar: $(el).find('.avatar').attr('src') || false
    });
  });

  return payload;
};

/**
 * @description Retrieve class messages from document
 * @param {String} document 
 * @returns {Array}
 */
const retrieveMessages = document => {
  const $ = cheerio.load(document);
  const payload = [];

  $('.discussion').each((i, el) => {
    const comments = [];
    $(el).find('.reply').each((i, elem) => {
      comments.push({
        title: encodeURI($(elem).find('h4.title').text()),
        content: $(elem).find('.body .fix-body-margins').html(), // This is potentially dangerous, XSS
        author: $(elem).find('.header strong').text(),
        avatar: $(elem).find('.avatar').attr('src') || false, 
        date: createDate($(elem).find('.header').text())
      });
    });

    const files = [];
    $(el).find('.list-unstyled a').each((i, elem) => {
      files.push($(elem).attr('href'));
    });

    payload.push({
      title: encodeURI($(el).find('.discussion-content h4.title').text()),
      link: $(el).find('.discussion-content h4.title a').attr('href'),
      content: $(el).find('.discussion-content .fix-body-margins').html(), // This is potentially dangerous, XSS
      author: $(el).find('.discussion-content .header strong').text(),
      avatar: $(el).find('.discussion-content .avatar').attr('src') || false,
      date: createDate($(el).find('.header').text()),
      files: files,
      comments: comments
    });
  });

  return payload;
};

/**
 * @description Retrieve class list from document hamburger menu
 * @param {String} document
 * @returns {Array}
 */
const retrieveClasses = document => {
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
 * @description Retrieve group list from document hamburger menu
 * @param {String} document
 * @returns {Array}
 */
const retrieveGroups = document => {
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
 * @description Retrieve notification list from document
 * @param {String} document 
 * @returns {Array}
 */
const retrieveNotifications = document => {
  const $ = cheerio.load(document);
  const payload = [];

  $('tr.message').each((i, el) => {
    payload.push({
      title: encodeURI($(el).find('.title a').text()),
      link: $(el).find('.title a').attr('href'),
      author: $(el).find('td:nth-child(3)').text(),
      dateString: $(el).find('td:last-child').text(), // Not possible to obtain exact date in list view 
      unread: $(el).hasClass('unread') // Boolean
    });
  });

  return payload;
};

/**
 * @description Retrieve single notification from document
 * @param {String} document 
 * @returns {Object}
 */
const retrieveNotification = document => {
  const $ = cheerio.load(document);
  const date = $('.message-details p:last-child strong').text();
  const payload =  {
    title: encodeURI($('.content-block h3').text()),
    author: $('.message-details p:first-child strong').text(),
    date: new Date(Number(date.match(/\d{4}/)), getMonth(date.match(/^\w+/)[0]), Number(date.match(/\d{1,2}(?=,)/)), Number(date.match(/\d{1,2}(?=:)/)), Number(date.match(/\d{2}$/)))
  };
  $('.message-notifications .message-details').remove();
  payload.content = $('.message-notifications').html();
  return payload;
};

/** 
 * @description Retrieve notification count from document
 * @param {String} document 
 * @returns {Number}
 */
const retrieveNotificationCount = document => {
  const $ = cheerio.load(document);
  return $('.notifications-count').data('count');
};

/**
 * @description Retrieve content from the details section of document
 * @param {String} document 
 * @returns {String}
 */
const retrieveDetails = document => {
  const $ = cheerio.load(document);
  return $('label:contains("Details")').next().html(); // This is potentially dangerous, XSS
};

/**
 * @description Retrieve attachments from document 
 * @param {String} document 
 * @returns {Array}
 */
const retrieveAttachments = document => {
  const $ = cheerio.load(document);
  const payload = [];

  $('.content-block .list-unstyled a').each((i, el) => {
    payload.push($(el).attr('href'));
  });

  return payload;
};

/**
 * @description Retrieve dropbox from document 
 * @param {String} document 
 * @returns {Array} 
 */
const retrieveDropbox = document => {
  const $ = cheerio.load(document);
  const payload = [];

  $('.row.file').each((i, el) => {
    payload.push({
      title: encodeURI($(el).find('.details a').text()),
      link: $(el).find('.details a').attr('href'),
      date: createDate($(el).find('.details label').text()),
      similarity: Number($(el).find('span.hidden-xs').next().text())
    });
  });

  return payload;
};

/**
 * @description Retrieve number of pages based on pagination buttons at the bottom of document
 * @param {String} document 
 * @returns {Number}
 */
const retrieveNumberOfPages = document => {
  const $ = cheerio.load(document);

  return $('.pagination').find('li').length - 2;
}

/**
 * @description Load dashboard
 * @param {Object} req
 * @param {Object} res 
 */
exports.loadDefaults = (req, res) => {
  res.append('Managebac-Data', JSON.stringify({
    deadlines: retrieveDeadlines(req.document),
    classes: retrieveClasses(req.document),
    groups: retrieveGroups(req.document),
    notificationCount: retrieveNotificationCount(req.document)
  }));

  res.status(200).end();
};

/**
 * @description Load class/group overview
 * @param {Object} req 
 * req must have a document property 
 * @param {Object} res 
 */
exports.loadOverview = (req, res) => {
  res.append('Managebac-Data', JSON.stringify({
    deadlines: retrieveDeadlines(req.document)
  }));

  res.status(200).end();
};

/**
 * @description Load class assignment list 
 * @param {Object} req 
 * req must have a document property 
 * @param {Object} res 
 */
exports.loadAssignments = (req, res) => {
  const arr = retrieveDeadlines(req.document);
  res.append('Managebac-Data', JSON.stringify({
    upcoming: arr.filter(val => val.due.getTime() >= new Date().getTime()),
    completed: arr.filter(val => val.due.getTime() < new Date().getTime())
  }));

  res.status(200).end();
};


/**
 * @description Load class/group messages 
 * @param {Object} req 
 * req must have a document property 
 * @param {Object} res 
 */
exports.loadMessages = (req, res) => {
  res.append('Managebac-Data', JSON.stringify({
    messages: retrieveMessages(req.document),
    numberOfPages: retrieveNumberOfPages(req.document)
  }));

  res.status(200).end();
};

/**
 * @description Load single assignment 
 * @param {Object} req
 * req must have a document property
 * @param {Object} res 
 */
exports.loadAssignment = (req, res) => {
  res.append('Managebac-Data', JSON.stringify({
    assignment: Object.assign(retrieveDeadlines(req.document)[0], {
      details: retrieveDetails(req.document),
      attachments: retrieveAttachments(req.document),
      dropbox: retrieveDropbox(req.document),
      messages: retrieveMessages(req.document)
    })
  }));

  res.status(200).end();
};

/**
 * @description Load single message
 * @param {Object} req
 * req must have a document property 
 * @param {Object} res 
 */
exports.loadMessage = (req, res) => {
  res.append('Managebac-Data', JSON.stringify({
    message: retrieveMessages(req.document)
  }));

  res.status(200).end();
};

/**
 * @description Load notification list
 * @param {Object} req 
 * req must have a document property 
 * @param {Object} res 
 */
exports.loadNotifications = (req, res) => {
  res.append('Managebac-Data', JSON.stringify({
    notifications: retrieveNotifications(req.document),
    numberOfPages: retrieveNumberOfPages(req.document)
  }));

  res.status(200).end();
};

/**
 * @description Load single notification 
 * @param {Object} req 
 * req must have a document property 
 * @param {Object} res 
 */
exports.loadNotification = (req, res) => {
  res.append('Managebac-Data', JSON.stringify({
    notification: retrieveNotification(req.document)
  }));

  res.status(200).end();
};

/**
 * @description Load CAS dashboard 
 * @param {Object} req 
 * req must have a document property 
 * @param {Object} res 
 */
exports.loadCas = (req, res) => {
  res.status(200).end();
};