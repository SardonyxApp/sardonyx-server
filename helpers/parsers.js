/**
 * @fileoverview Parse Managebac content.
 * @author SardonyxApp
 * @license MIT 
 */

const cheerio = require('cheerio');
const { 
  getMonthFromAbbr, 
  getMonth, 
  guessFutureYear, 
  guessPastYear, 
  createDate, 
  toPlainText,
  matchNumbers,
  toSardonyxUrl
} = require('./helpers');

/**
 * @description Custom method for replacing \n characters 
 * @param {String} str 
 * @returns {String}
 */
String.prototype.delNewlines = function(str = '') { // replace with '' by default 
  return this.replace(/\n/g, str);
};

/**
 * @description Parse Authenticity token in the document 
 * @param {String} document 
 * @returns {String}
 */
exports.parseAuthenticityToken = document => {
  const $ = cheerio.load(document, { decodeEntities: false });
  return $('meta[name="csrf-token"]').attr('content');
};

/**
 * @description Parse upcoming deadlines and events from overview document
 * @param {String} document 
 * @returns {Array}
 */
exports.parseDeadlines = document => {
  const $ = cheerio.load(document, { decodeEntities: false });
  const payload = [];

  $('.agenda > .line').each((i, el) => {
    const labels = [];
    $(el).find('.label').each((idx, label) => {
      labels.push($(label).text().delNewlines()); 
    });

    // Because the date format is different for this one, it uses a different implementation
    const due = $(el).find('.due').text(); // Ex: Wednesday at 8:30 PM

    // If hour is 12 AM or PM, convert to 0 AM or 0 PM for accurate processing
    let hour = due.match(/\d{1,2}(?=:\d{2})/)[0];
    hour = hour % 12 === 0 ? 0 : hour;

    // Build each component of time
    const dueMinute = due.match(/\d{2}(?= [AP]M)/);
    const dueHour = due.match(/[AP]M/)[0] === 'AM' ? Number(hour) : Number(hour) + 12; // if PM, add 12 hours
    const dueDay = $(el).find('.day').text(); // Match from icon
    const dueMonth = getMonthFromAbbr($(el).find('.month').text()); // Match from icon
    const dueYear = $(el).find('.date-badge').hasClass('past-due') ? guessPastYear(dueMonth) : guessFutureYear(dueMonth); // listed as upcoming deadline or past deadline

    // Two types of deadlines can be loaded:
    // 1) linked deadlines: contains id, link, author, and avatar 
    // 2) title of page: id, link, author, and avarar are null 
    payload.push({
      id: matchNumbers($(el).find('.title a').attr('href')) || null,
      title: encodeURI($(el).find('h4.title').text().delNewlines()), 
      link: toSardonyxUrl($(el).find('.title a').attr('href')) || null,
      labels,
      deadline: $(el).find('.due').hasClass('deadline'), // Boolean
      due: new Date(Date.UTC(dueYear, dueMonth, dueDay, dueHour, dueMinute) - 32400000), // Set in correct UTC
      author: $(el).find('.author').attr('title') || null,
      authorId: Number($(el).find('.avatar').data('id')),
      avatar: $(el).find('.avatar').attr('style') ? $(el).find('.avatar').attr('style').match(/background-image: url\((.*)\)/)[1] : null
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
  const $ = cheerio.load(document, { decodeEntities: false });
  const payload = [];

  $('#menu > .nav-menu > li[data-path*="classes"] li').each((i, el) => {
    payload.push({
      id: matchNumbers($(el).find('a').attr('href')),
      title: encodeURI($(el).find('a').text().delNewlines()),
      link: toSardonyxUrl($(el).find('a').attr('href'))
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
  const $ = cheerio.load(document, { decodeEntities: false });
  const payload = [];

  $('#menu > .nav-menu > li[data-path*="groups"] li').each((i, el) => {
    payload.push({
      id: matchNumbers($(el).find('a').attr('href')),
      title: encodeURI($(el).find('a').text().delNewlines()),
      link: toSardonyxUrl($(el).find('a').attr('href'))
    });
  });

  payload.pop(); //Remove last item which says "Join more groups"
  return payload;
};

/** 
 * @description Parse notification count from document
 * @param {String} document 
 * @returns {Number}
 */
exports.parseNotificationCount = document => {
  const $ = cheerio.load(document, { decodeEntities: false });
  return $('.notifications-count').data('count');
};

/**
 * @description Parse notification list from document
 * @param {String} document 
 * @returns {Array}
 */
exports.parseNotifications = document => {
  const $ = cheerio.load(document, { decodeEntities: false });
  const payload = [];

  $('tr.message').each((i, el) => {
    payload.push({
      id: Number($(el).data('id')),
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
  const $ = cheerio.load(document, { decodeEntities: false });
  const date = $('.message-details p:last-child strong').text();
  const payload =  {
    title: encodeURI($('.content-block h3').text().delNewlines()),
    author: $('.message-details p:first-child strong').text(),
    date: new Date(Date.UTC(date.match(/\d{4}/), getMonth(date.match(/^\w+/)[0]), date.match(/\d{1,2}(?=,)/), date.match(/\d{1,2}(?=:)/), date.match(/\d{2}$/)) - 32400000)
  };
  $('.message-notifications .message-details').remove();
  payload.content = $('.message-notifications').html();
  return payload;
};

/**
 * @description Parse content from the details section of document
 * @param {String} document 
 * @returns {String}
 */
exports.parseDetails = document => {
  const $ = cheerio.load(document, { decodeEntities: false });
  try {
    return $('label:contains("Details")').next().html().delNewlines();
  } catch (e) {
    return null; // If the assignment/event has no details, it will throw an error which will be catched here
  }
};

/**
 * @description Parse attachments from document 
 * @param {String} document 
 * @returns {Array}
 */
exports.parseAttachments = document => {
  const $ = cheerio.load(document, { decodeEntities: false });
  const payload = [];

  $('.content-block .list-unstyled a').each((i, el) => {
    payload.push({
      name: encodeURI($(el).text()),
      link: $(el).attr('href')
    });
  });

  return payload;
};

/**
 * @description Parse dropbox from document 
 * @param {String} document 
 * @returns {Array} 
 */
exports.parseDropbox = document => {
  const $ = cheerio.load(document, { decodeEntities: false });
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
 * @description Parse author listed to the side 
 * @param {String} document 
 * @returns {Object} merge this with the main object 
 */
exports.parseAuthorOnTheSide = document => {
  const $ = cheerio.load(document, { decodeEntities: false });

  return {
    author: $('.mini-profile .user-name').text().delNewlines(),
    authorId: Number($('.mini-profile .avatar').data('id')),
    avatar: $('.mini-profile .avatar').attr('src') || null,
    avatar: $('.mini-profile .avatar').attr('style') ? $('.mini-profile .avatar').attr('style').match(/background-image: url\((.*)\)/)[1] : null
  };
};

/**
 * @description Parse class messages from document
 * @param {String} document 
 * @returns {Array}
 */
exports.parseMessages = document => {
  const $ = cheerio.load(document, { decodeEntities: false });
  const payload = [];

  $('.discussion').each((i, el) => {
    let comments = [];
    $(el).find('.reply').each((idx, elem) => {
      const files = [];
      // Attached to new messages 
      $(elem).find('a').each((index, element) => {
        if ($(element).is('[data-file]')) files.push($(element).attr('href'));
      });

      comments.push({
        id: matchNumbers($(elem).attr('id')),
        content: $(elem).find('.body .fix-body-margins').html(),
        onlyVisibleForTeachers: $(elem).find('.header .label-danger').text() === 'Only Visible for Teachers',
        author: $(elem).find('.header strong').text(),
        authorId: Number($(elem).find('.avatar').data('id')),
        avatar: $(elem).find('.avatar').attr('style') ? $(elem).find('.avatar').attr('style').match(/background-image: url\((.*)\)/)[1] : null, 
        date: createDate($(elem).find('.header').text()),
        comments: !!$(elem).find('.show-reply').length, // Boolean
        files
      });
    });

    if (comments.length === 0) { 
      // No comments attached, however there may be an indication of the number of comments
      comments = $(el).find('.divider').last().next().find('a:not(.btn)').length ? Number($(el).find('.divider').last().next().find('a:not(.btn)').text().match(/\d+/)[0]) : [];
    }

    const files = [];
    
    // Attached to old messages 
    $(el).find('.list-unstyled a').each((idx, elem) => {
      files.push($(elem).attr('href'));
    });
    // Attached to new messages 
    $(el).find('a').each((idx, elem) => {
      if ($(elem).is('[data-file]')) files.push($(elem).attr('href'));
    });

    payload.push({
      id: matchNumbers($(el).attr('id')),
      title: encodeURI($(el).find('.discussion-content h4.title').text().delNewlines()),
      link: toSardonyxUrl($(el).find('.discussion-content h4.title a').attr('href')),
      content: $(el).find('.discussion-content .fix-body-margins').html(),
      onlyVisibleForTeachers: $(el).find('.discussion-content .header .label-danger').text() == 'Only Visible for Teachers',
      author: $(el).find('.discussion-content .header strong').text(),
      authorId: Number($(el).find('.avatar').data('id')),
      avatar: $(el).find('.avatar').attr('style') ? $(el).find('.avatar').attr('style').match(/background-image: url\((.*)\)/)[1] : null,
      date: createDate($(el).find('.header').text()),
      files: files,
      comments
    });
  });

  return payload;
};

/**
 * @description Parse reply of reply 
 * @param {String} document 
 * @returns {Array} 
 */
exports.parseReplyOfReply = document => {
  const $ = cheerio.load(document, { decodeEntities: false });
  const comments = [];

  const files = [];
  $('a').each((i, elem) => {
    if ($(elem).is('[data-file]')) files.push($(elem).attr('href'));
  });

  $('.reply').each((i, elem) => {
    comments.push({
      id: matchNumbers($(elem).attr('id')),
      content: $(elem).find('.body .fix-body-margins').html(),
      onlyVisibleForTeachers: $(elem).find('.header .label-danger').text() === 'Only Visible for Teachers',
      author: $(elem).find('.header strong').text(),
      authorId: Number($(elem).find('.avatar').data('id')),
      avatar: $(elem).find('.avatar').attr('style') ? $(elem).find('.avatar').attr('style').match(/background-image: url\((.*)\)/)[1] : null,
      date: createDate($(elem).find('.header').text()),
      files
    });
  });
  return comments;
};

/**
 * @description Parse CAS activity list from document 
 * @param {String} document 
 * @returns {Array}
 */
exports.parseCas = document => {
  const $ = cheerio.load(document, { decodeEntities: false });
  const payload = [];

  $('.activity-tile').each((i, el) => {
    // An experience can have multiple types 
    const types = [];
    // Check labels 
    if ($(el).find('.labels-and-badges .tip').hasClass('hour-type-hint-c')) types.push('creativity');
    if ($(el).find('.labels-and-badges .tip').hasClass('hour-type-hint-a')) types.push('activity');
    if ($(el).find('.labels-and-badges .tip').hasClass('hour-type-hint-s')) types.push('service');

    const labels = [];
    $(el).find('.labels-and-badges .label').each((idx, elem) => {
      labels.push($(elem).text());
    });

    payload.push({
      id: matchNumbers($(el).find('.details a').attr('href')),
      title: encodeURI($(el).find('h3.title a').text().delNewlines()),
      link: toSardonyxUrl($(el).find('.details a').attr('href')),
      description: encodeURI($(el).find('.description').text()) || null, // Doesn't exist for experiences
      types,
      status:  $(el).find('.status-icon img').attr('src').match(/approved|complete|rejected|needs_approval/)[0] || null,
      labels,
      project: /cas_project/.test($(el).find('.labels-and-badges img').attr('src')),
      commentCount: Number($(el).find('.comments-count').text().delNewlines()),
      reflectionCount: $(el).find('.reflections-count').text() || null // Only exists for CAS dashhboard 
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
  const $ = cheerio.load(document, { decodeEntities: false });

  return {
    description: encodeURI(toPlainText($('h4').eq(0).nextUntil('h4').html())),
    learningOutcomes: encodeURI(toPlainText($('h4').eq(1).nextUntil('.divider.compact').html())), // does not parse IDs
    timespan: $('.cas-activity-calendar').text().delNewlines()
  };
};

/**
 * @description Parse CAS questions and answers from document 
 * @param {String} document
 * @returns {Array} 
 */
exports.parseAnswers = document => {
  const $ = cheerio.load(document, { decodeEntities: false });
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
  const $ = cheerio.load(document, { decodeEntities: false });
  const payload = [];

  $('.evidence').each((i, el) => {
    const labels = [];
    $(el).find('.labels-set .label').each((i, elem) => {
      labels.push($(elem).text());
    });

    // Common for all types of evidences / reflections 
    const obj = {
      id: matchNumbers($(el).attr('id')),
      date: createDate($(el).find('h4.title').text(), true),
      labels
    }; 

    if ($(el).hasClass('journal-evidence')) { // Reflection
      obj.type = 'reflection';
      obj.content = encodeURI($(el).find('.fix-body-margins').html());
    } else if ($(el).hasClass('website-evidence')) { // Link
      obj.type = 'link';
      obj.title = encodeURI($(el).find('.body a').text().delNewlines());
      obj.link = $(el).find('.body a').attr('href');
      obj.description = encodeURI($(el).find('.body p').text());
    } else if ($(el).hasClass('album-evidence')) { // Photo
      obj.type = 'photo';
      obj.photos = [];
      $(el).find('.photo').each((idx, elem) => {
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
 * @description Parse learning outcomes form form data 
 * @param {String} document 
 * @returns {Array} 
 */
exports.parseLearningOutcomes = document => {
  const $ = cheerio.load(document, { decodeEntities: false });
  const payload = [];
  
  $('input[type="checkbox"]').each((i, el) => {
    payload.push({
      id: Number($(el).attr('value')),
      name: $(el).parent().text()
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
  const $ = cheerio.load(document, { decodeEntities: false });

  const len = $('.pagination').find('li').length - 2; // Subtract back and next buttons
  return len === -2 ? 1 : len; // If there are no buttons, len = -2. In that case there is 1 page
};

/**
 * @description Parse information about the student and their cohort 
 * @param {String} document 
 * @returns {Object}
 */
exports.parseStudent = document => {
  const $ = cheerio.load(document, { decodeEntities: false });
  
  const obj = {
    name: $('.profile-link > a ').text().delNewlines(),
    year: Number($('td.col-sm-4').first().text().match(/\d{4}/)) + 3,
  };
  obj.tasklist_id = obj.year - 2017; // 3rd cohort is year of 2020
  return obj;
}

/**
 * @description Prase information about the student from the top right corner menu 
 * @param {String} document 
 * @returns {Object}
 */
exports.parseUser = document => {
  const $ = cheerio.load(document, { decodeEntities: false });

  return {
    id: Number($('body').data('user-id')),
    name: $('.profile-link > a').text().delNewlines(),
    avatar: $('.profile-link .avatar').attr('style') ? $('.profile-link .avatar').attr('style').match(/background-image: url\((.*)\)/)[1] : null
  };
}