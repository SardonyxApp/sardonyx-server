/**
 * @fileoverview Helper functions used in authentication.
 * @author SardonyxApp
 * @license MIT
 */

const cheerio = require('cheerio');
const { getMonthFromAbbr, getMonth, guessFutureYear, guessPastYear, createDate } = require('./helpers');

// Custom method for replacing \n characters 
String.prototype.delNewlines = function() {
  return this.replace(/\n/g, '');
};

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
      labels.push($(label).text().delNewlines()); 
    });

    const due = $(el).find('.due').text();
    const dueMinute = due.match(/\d{2}(?= [AP]M)/);
    const dueHour = due.match(/[AP]M$/) === 'AM' ? due.match(/\d{1,2}(?=:\d{2})/)[0] : Number(due.match(/\d{1,2}(?=:\d{2})/)[0]) + 12;
    const dueMonth = getMonthFromAbbr($(el).find('.month').text());
    const dueYear = $(el).parent().prev('h3').text().includes('Upcoming') ? guessFutureYear(dueMonth) : guessPastYear(dueMonth);

    payload.push({
      title: encodeURI($(el).find('h4.title').text().delNewlines()), 
      link: $(el).find('.title a').attr('href') || null,
      labels: labels,
      deadline: $(el).find('.due').hasClass('deadline'), // Boolean
      due: new Date(dueYear, dueMonth, $(el).find('.day').text(), dueHour, dueMinute),
      author: $(el).find('.author').attr('title') || null,
      avatar: $(el).find('.avatar').attr('src') || null
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
        title: encodeURI($(elem).find('h4.title').text().delNewlines()),
        content: $(elem).find('.body .fix-body-margins').html(), // This is potentially dangerous, XSS
        author: $(elem).find('.header strong').text(),
        avatar: $(elem).find('.avatar').attr('src') || null, 
        date: createDate($(elem).find('.header').text())
      });
    });

    const files = [];
    $(el).find('.list-unstyled a').each((i, elem) => {
      files.push($(elem).attr('href'));
    });

    payload.push({
      title: encodeURI($(el).find('.discussion-content h4.title').text().delNewlines()),
      link: $(el).find('.discussion-content h4.title a').attr('href'),
      content: $(el).find('.discussion-content .fix-body-margins').html(), // This is potentially dangerous, XSS
      author: $(el).find('.discussion-content .header strong').text(),
      avatar: $(el).find('.discussion-content .avatar').attr('src') || null,
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
      title: encodeURI($(el).find('a').text().delNewlines()),
      link: $(el).find('a').attr('href')
    });
  });

  payload.pop(); // Remove last item which says "Join more classes"
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
      title: encodeURI($(el).find('a').text().delNewlines()),
      link: $(el).find('a').attr('href')
    });
  });

  payload.pop(); //Remove last item which says "Join more groups"
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
      title: encodeURI($(el).find('.title a').text().delNewlines()),
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
    title: encodeURI($('.content-block h3').text().delNewlines()),
    author: $('.message-details p:first-child strong').text(),
    date: new Date(date.match(/\d{4}/), getMonth(date.match(/^\w+/)[0]), date.match(/\d{1,2}(?=,)/), date.match(/\d{1,2}(?=:)/), date.match(/\d{2}$/))
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
  return $('label:contains("Details")').next().html().delNewlines(); // This is potentially dangerous, XSS
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
      similarity: Number($(el).find('span.hidden-xs').next().text()) || null
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
};

/**
 * @description Retrieve CAS activity list from document 
 * @param {String} document 
 * @returns {Array}
 */
const retrieveCas = document => {
  const $ = cheerio.load(document);
  const payload = [];

  $('.activity-tile').each((i, el) => {
    // An experience can have multiple types 
    const types = [];
    if ($(el).find('.labels-and-badges .tip').hasClass('hour-type-hint-c')) types.push('creativity');
    if ($(el).find('.labels-and-badges .tip').hasClass('hour-type-hint-a')) types.push('activity');
    if ($(el).find('.labels-and-badges .tip').hasClass('hour-type-hint-s')) types.push('service');

    const labels = [];
    $(el).find('.labels-and-badges .label').each((i, elem) => {
      labels.push($(elem).text());
    });

    payload.push({
      title: encodeURI($(el).find('h4.title a').text().delNewlines()),
      link: $(el).find('.details a').attr('href'),
      description: encodeURI($(el).find('.description').text()) || null,
      types: types,
      status:  $(el).find('.status-icon img').attr('src').match(/approved|complete|rejected|needs_approval/)[0] || null,
      labels: labels,
      project: /cas_project/.test($(el).find('.labels-and-badges img').attr('src')),
      commentCount: Number($(el).find('.comments-count').text().delNewlines()),
      reflectionCount: $(el).find('.reflections-count').text() || null // String, for convenience
    });
  });

  return payload;
};

/**
 * @description Retrieve CACS experience from document 
 * @param {String} document 
 * @returns {Object}
 */
const retrieveExperience = document => {
  const $ = cheerio.load(document);
  $('.content-block-header').remove();
  $('.activity-tile').remove();
  $('.divider.compact').prev().nextAll().remove();
  return {
    content: $('.content-block').html().delNewlines(), // This is potentially dangerous, XSS
    timespan: $('.cas-activity-calendar').text()
  };
};

/**
 * @description Retrieve CAS questions and answers from document 
 * @param {String} document
 * @returns {Array} 
 */
const retrieveAnswers = document => {
  const $ = cheerio.load(document);
  const payload = [];

  if ($('.content-block form').length > 0) { // Ongoing CAS experience
    $('.form-group').each((i,  el) => {
      payload.push({
        question: $(el).find('label').text(),
        answer: encodeURI($(el).find('textarea').val())
      });
    });
  } else { // Completed CAS experience
    $('.content-block label').each((i, el) => {
      let answer = '';
      const addAnswer = elem => {
        if ($(elem).next('p').length > 0) {
          answer += '\n' + $(elem).next('p');
          addAnswer($(elem).next('p'));
        };
      };
      addAnswer(el);

      payload.push({
        question: $(el).text(),
        answer: encodeURI(answer) // Not sure if this is the best way to recursively add paragraphs
      });
    });
  }

  return payload;
};

/**
 * @description Retrieve CAS reflections from document
 * @param {String} document 
 * @returns {Array}
 */
const retrieveReflections = document => {
  const $ = cheerio.load(document);
  const payload = [];

  $('.evidence').each((i, el) => {
    const labels = [];
    $('.labels-set .label').each((i, elem) => {
      labels.push($(elem).text());
    });

    const obj = {
      date: createDate($(el).find('h4.title').text(), true),
      labels: labels
    };

    if ($(el).hasClass('journal-evidence')) { // Reflection
      obj.type = 'reflection';
      obj.content = encodeURI($(el).find('.fix-body-margins').html()); // This is potentially dangerous, XSS
    } else if ($(el).hasClass('website-evidence')) { // Link
      obj.type = 'link';
      obj.title = encodeURI($(el).find('.body a').text().delNewlines());
      obj.link = $(el).find('.body a').attr('href');
      obj.description = encodeURI($(el).find('.body p').text());
    } else if ($(el).hasClass('album-evidence')) { // Photo
      obj.type = 'photo';
      obj.photos = [];
      $(el).find('.photo').each((i, elem) => {
        obj.photos.push({
          title: encodeURI($(elem).attr('title')),
          link: $(elem).data('full-url')
        });
      });
    } else { //File, Video
      obj.type = 'other';
      obj.content = 'Sardonyx: This type of evidence is not supported yet.';
    }

    payload.push(obj);
  });

  return payload;
};

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
 * @description Send a message 
 * @param {Object} req 
 * @param {Object} res 
 */
exports.sendMessage = (req, res) => {
  res.status(200).end();
}

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
  res.append('Managebac-Data', JSON.stringify({
    cas: retrieveCas(req.document),
    documents: retrieveDropbox(req.document)
  }));

  res.status(200).end();
};

/**
 * @description Load CAS experience 
 * @param {Object} req 
 * req must have a document property 
 * @param {Object} res 
 */
exports.loadExperience = (req, res) => {
  res.append('Managebac-Data', JSON.stringify({
    cas: Object.assign(retrieveCas(req.document)[0], retrieveExperience(req.document))
  }));

  res.status(200).end();
};

/**
 * @description Load CAS questions and answers 
 * @param {Object} req 
 * req must have a document property 
 * @param {Object} res 
 */
exports.loadAnswers = (req, res) => {
  res.append('Managebac-Data', JSON.stringify({
    answers: retrieveAnswers(req.document)
  }));

  res.status(200).end();
};

/**
 * @description Load CAS reflections 
 * @param {Object} req 
 * req must have a document property 
 * @param {Object} res 
 */
exports.loadReflections = (req, res) => {
  res.append('Managebac-Data', JSON.stringify({
    reflections: retrieveReflections(req.document)
  }));

  res.status(200).end();
};