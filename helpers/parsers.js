/**
 * @fileoverview Parse Managebac content.
 * @author SardonyxApp
 * @license MIT 
 */

const cheerio = require('cheerio');
const { getMonthFromAbbr, getMonth, guessFutureYear, guessPastYear, createDate, toSardonyxUrl } = require('./helpers');

// Custom method for replacing \n characters 
String.prototype.delNewlines = function() {
  return this.replace(/\n/g, '');
};

/**
 * @description Parse CSRF token in the document 
 * @param {String} document 
 * @returns {String}
 */
exports.parseCSRFToken = document => {
  const $ = cheerio.load(document);
  return $('meta[name="csrf-token"]').attr('content');
};

/**
 * @description Parse upcoming deadlines and events from overview document
 * @param {String} document 
 * @returns {Array}
 */
exports.parseDeadlines = document => {
  const $ = cheerio.load(document);
  const payload = [];

  $('.agenda > .line').each((i, el) => {
    const labels = [];
    $(el).find('.label').each((i, label) => {
      labels.push($(label).text().delNewlines()); 
    });

    // Because the date format is different for this one, it uses a different implementation
    const due = $(el).find('.due').text(); // Ex: Wednesday at 8:30 PM
    const dueMinute = due.match(/\d{2}(?= [AP]M)/);
    const dueHour = due.match(/[AP]M$/) === 'AM' ? due.match(/\d{1,2}(?=:\d{2})/)[0] : Number(due.match(/\d{1,2}(?=:\d{2})/)[0]) + 12; // if PM, add 12 hours
    const dueDay = $(el).find('.day').text(); // Match from icon
    const dueMonth = getMonthFromAbbr($(el).find('.month').text()); // Match from icon
    const dueYear = $(el).parent().prev('h3').text().includes('Upcoming') ? guessFutureYear(dueMonth) : guessPastYear(dueMonth); // listed as upcoming deadline or past deadline

    payload.push({
      title: encodeURI($(el).find('h4.title').text().delNewlines()), 
      link: toSardonyxUrl($(el).find('.title a').attr('href')) || null,
      labels: labels,
      deadline: $(el).find('.due').hasClass('deadline'), // Boolean
      due: new Date(dueYear, dueMonth, dueDay, dueHour, dueMinute),
      author: $(el).find('.author').attr('title') || null,
      avatar: $(el).find('.avatar').attr('src') || null
    });
  });

  return payload;
};

/**
 * @description Parse class messages from document
 * @param {String} document 
 * @returns {Array}
 */
exports.parseMessages = document => {
  const $ = cheerio.load(document);
  const payload = [];

  $('.discussion').each((i, el) => {
    let comments = [];
    // TODO: parse comments of comments
    $(el).find('.reply').each((i, elem) => {
      comments.push({
        id: Number($(elem).attr('id').match(/\d+/)[0]),
        title: encodeURI($(elem).find('h4.title').text().delNewlines()),
        content: $(elem).find('.body .fix-body-margins').html(), // This is potentially dangerous, XSS
        onlyVisibleForTeachers: $(elem).find('.header .label-danger').text() === 'Only Visible for Teachers',
        author: $(elem).find('.header strong').text(),
        avatar: $(elem).find('.avatar').attr('src') || null, 
        date: createDate($(elem).find('.header').text()),
        comments: !!$(elem).find('.show-reply').length // Boolean
      });
    });

    if (comments.length === 0 && !!$(el).find('.cell a:not(.btn)').length) { 
      // No comments attached, however there may be an indication of the number of comments
      comments = Number($(el).find('.cell a:not(.btn)').text().match(/\d+/)[0]);
    }

    const files = [];
    $(el).find('.list-unstyled a').each((i, elem) => {
      files.push($(elem).attr('href'));
    });

    payload.push({
      title: encodeURI($(el).find('.discussion-content h4.title').text().delNewlines()),
      link: toSardonyxUrl($(el).find('.discussion-content h4.title a').attr('href')),
      content: $(el).find('.discussion-content .fix-body-margins').html(), // This is potentially dangerous, XSS
      onlyVisibleForTeachers: $(el).find('.header .label-danger').text() == 'Only Visible for Teachers',
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
 * @description Parse class list from document hamburger menu
 * @param {String} document
 * @returns {Array}
 */
exports.parseClasses = document => {
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
 * @description Parse group list from document hamburger menu
 * @param {String} document
 * @returns {Array}
 */
exports.parseGroups = document => {
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
 * @description Parse notification list from document
 * @param {String} document 
 * @returns {Array}
 */
exports.parseNotifications = document => {
  const $ = cheerio.load(document);
  const payload = [];

  $('tr.message').each((i, el) => {
    payload.push({
      title: encodeURI($(el).find('.title a').text().delNewlines()),
      link: toSardonyxUrl($(el).find('.title a').attr('href')), 
      author: $(el).find('td:nth-child(3)').text(),
      dateString: $(el).find('td:last-child').text(), // Not possible to obtain exact date in list view 
      unread: $(el).hasClass('unread') // Boolean
    });
  });

  return payload;
};

/**
 * @description Parse single notification from document
 * @param {String} document 
 * @returns {Object}
 */
exports.parseNotification = document => {
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
 * @description Parse notification count from document
 * @param {String} document 
 * @returns {Number}
 */
exports.parseNotificationCount = document => {
  const $ = cheerio.load(document);
  return $('.notifications-count').data('count');
};

/**
 * @description Parse content from the details section of document
 * @param {String} document 
 * @returns {String}
 */
exports.parseDetails = document => {
  const $ = cheerio.load(document);
  try {
    return $('label:contains("Details")').next().html().delNewlines(); // This is potentially dangerous, XSS
  } catch (e) {
    return null; // If the assignment/event has no details, it will throw an error
  }
};

/**
 * @description Parse attachments from document 
 * @param {String} document 
 * @returns {Array}
 */
exports.parseAttachments = document => {
  const $ = cheerio.load(document);
  const payload = [];

  $('.content-block .list-unstyled a').each((i, el) => {
    payload.push($(el).attr('href'));
  });

  return payload;
};

/**
 * @description Parse dropbox from document 
 * @param {String} document 
 * @returns {Array} 
 */
exports.parseDropbox = document => {
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
 * @description Parse number of pages based on pagination buttons at the bottom of document
 * @param {String} document 
 * @returns {Number}
 */
exports.parseNumberOfPages = document => {
  const $ = cheerio.load(document);

  const len = $('.pagination').find('li').length - 2; // Subtract back and next buttons
  return len === -2 ? 1: len; // If there are no buttons, len = -2. In that case there is 1 page
};

/**
 * @description Parse CAS activity list from document 
 * @param {String} document 
 * @returns {Array}
 */
exports.parseCas = document => {
  const $ = cheerio.load(document);
  const payload = [];

  $('.activity-tile').each((i, el) => {
    // An experience can have multiple types 
    const types = [];
    // Check labels 
    if ($(el).find('.labels-and-badges .tip').hasClass('hour-type-hint-c')) types.push('creativity');
    if ($(el).find('.labels-and-badges .tip').hasClass('hour-type-hint-a')) types.push('activity');
    if ($(el).find('.labels-and-badges .tip').hasClass('hour-type-hint-s')) types.push('service');

    const labels = [];
    $(el).find('.labels-and-badges .label').each((i, elem) => {
      labels.push($(elem).text());
    });

    payload.push({
      title: encodeURI($(el).find('h4.title a').text().delNewlines()),
      link: toSardonyxUrl($(el).find('.details a').attr('href')),
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
 * @description Parse CACS experience from document 
 * @param {String} document 
 * @returns {Object}
 */
exports.parseExperience = document => {
  const $ = cheerio.load(document);
  // These elements are included in .content-block so remove them before parsing
  $('.content-block-header').remove();
  $('.activity-tile').remove();
  $('.divider.compact').prev().nextAll().remove();
  return {
    content: $('.content-block').html().delNewlines(), // This is potentially dangerous, XSS
    timespan: $('.cas-activity-calendar').text()
  };
};

/**
 * @description Parse CAS questions and answers from document 
 * @param {String} document
 * @returns {Array} 
 */
exports.parseAnswers = document => {
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
 * @description Parse CAS reflections from document
 * @param {String} document 
 * @returns {Array}
 */
exports.parseReflections = document => {
  const $ = cheerio.load(document);
  const payload = [];

  $('.evidence').each((i, el) => {
    const labels = [];
    $('.labels-set .label').each((i, elem) => {
      labels.push($(elem).text());
    });

    // Common for all types of evidences / reflections 
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