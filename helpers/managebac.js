/**
 * @fileoverview Helper functions used in authentication.
 * @author SardonyxApp
 * @license MIT
 */

const parser = require('./parsers');

// Markdown to HTML parser
const showdown = require('showdown'); 
const converter = new showdown.Converter({simplifiedAutoLink: true, strikethrough: true, simpleLineBreaks: true});
converter.setFlavor('github'); // For now

/**
 * @description Custom method for replacing \n characters 
 * @param {String} str 
 * @returns {String}
 */
String.prototype.delNewlines = function(str = '') { // replace with '' by default 
  return this.replace(/\n/g, str);
};

/**
 * @description Create a Managebac URL (up to 3 layers)
 * @param {String} resource 
 * resource can be any of the valid Managebac resources, like classes and groups
 * @param {String} subresource 
 * subresource can be any of the valid Managebac subresources, like assignments and messages
 * @param {String} subitem 
 * @example createUrl('classes') with no parameters will return /students/classes
 * @example createUrl('classes') with :resouceId will return /student/classes/:classId
 * @example createUrl('classes', 'assignments') without :subresourceId will return /student/classes/:resourceId/assignments
 * @example createUrl('classes', 'assignments') with params will return /student/classes/:resourceId/assignments/:subresourceId
 * @example createUrl('classes', 'messages', 'replies') without :subitemId will return /student/classes/:resourceId/messages/:subresourceId/replies
 * @example createUrl('classes', 'messages', 'replies') with params will return /student/classes/:resourceId/messages/:subresourceId/replies/:subitemId
 */
exports.createUrl = (resource, subresource, subitem) => {
  return (req, res, next) => {
    req.url = `https://kokusaiib.managebac.com/student`;

    // This is nasty, but it is more readable than a recursive function with its own recursive params 
    if (resource) {
      req.url += `/${resource}`

      if (req.params.resourceId) {
        req.url += `/${req.params.resourceId}`;

        if(subresource) {
          req.url += `/${subresource}`;

          if (req.params.subresourceId) {
            req.url += `/${req.params.subresourceId}`;

            if (subitem) {
              req.url += `/${subitem}`;

              if (req.params.subitemId) req.url += `/${req.params.subitemId}`;
            }
          }
        }
      }
    }

    if (req.query.pageId) req.url += `/page/${req.query.pageId}`;
    else if (req.query.pageParam) req.url += `?page=${req.query.pageParam}`;

    next();
  };
};

/**
 * @description Load dashboard
 * @param {Object} req
 * @param {Object} res 
 */
exports.loadDefaults = (req, res) => {
  res.append('Managebac-Data', JSON.stringify({
    deadlines: parser.parseDeadlines(req.document),
    classes: parser.parseClasses(req.document),
    groups: parser.parseGroups(req.document),
    notificationCount: parser.parseNotificationCount(req.document)
  }));

  res.status(200).end();
};

/**
 * @description Load class/group overview
 * @param {Object} req 
 * @param {Object} res 
 */
exports.loadOverview = (req, res) => {
  res.append('Managebac-Data', JSON.stringify({
    deadlines: parser.parseDeadlines(req.document)
  }));

  res.status(200).end();
};

/**
 * @description Load class assignment list 
 * @param {Object} req 
 * @param {Object} res 
 */
exports.loadAssignments = (req, res) => {
  const arr = parser.parseDeadlines(req.document);
  res.append('Managebac-Data', JSON.stringify({
    upcoming: arr.filter(val => val.due.getTime() >= new Date().getTime()),
    completed: arr.filter(val => val.due.getTime() < new Date().getTime())
  }));

  res.status(200).end();
};


/**
 * @description Load class/group messages 
 * @param {Object} req 
 * @param {Object} res 
 */
exports.loadMessages = (req, res) => {
  res.append('Managebac-Data', JSON.stringify({
    messages: parser.parseMessages(req.document),
    numberOfPages: parser.parseNumberOfPages(req.document)
  }));

  res.status(200).end();
};

/**
 * @description Load single assignment 
 * @param {Object} req
 * @param {Object} res 
 */
exports.loadAssignment = (req, res) => {
  res.append('Managebac-Data', JSON.stringify({
    assignment: Object.assign(parser.parseDeadlines(req.document)[0], {
      details: parser.parseDetails(req.document),
      attachments: parser.parseAttachments(req.document),
      dropbox: parser.parseDropbox(req.document),
      messages: parser.parseMessages(req.document)
    }, parser.parseAuthorOnTheSide(req.document))
  }));

  res.status(200).end();
};

/**
 * @description Load single message
 * @param {Object} req
 * @param {Object} res 
 */
exports.loadMessage = (req, res) => {
  res.append('Managebac-Data', JSON.stringify({
    message: parser.parseMessages(req.document)
  }));

  res.status(200).end();
};

/**
 * @description Manipulate request to load reply before sending
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 */
exports.craftRequestForReplyOfReply = (req, res, next) => {
  // Since this type of request is special, the url has to be tweaked. 
  req.url = req.url.replace(/\/\d+$/, `?page=1&parent_id=${req.params.subitemId}`); // url should be .../replies?page=1&parent_id=:subitemId 

  req.formOptions = {
    'X-Requested-With': 'XMLHttpRequest',
  };

  next();
};

/**
 * @description Load replies of reply 
 * @param {Object} req 
 * @param {Object} res 
 */
exports.loadReplyOfReply = (req, res) => {
  req.document = req.document
    .match(/(?<!\\)'.{0,}?(?<!\\)'/g)[1] // HTML part
    .replace(/\\\\/g, '') // remove unnecessary backslashes 
    .replace(/\\(?=['"\/])/g, '');

  res.append('Managebac-Data', JSON.stringify({
    replyOfReply: parser.parseReplyOfReply(req.document)
  }));

  res.status(200).end();
};

/**
 * @description Craft a new message from data
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 */
exports.craftNewMessage = (req, res, next) => {
  req.body = JSON.parse(req.headers['message-data'] || '{}');
  req.form = {
    'discussion[topic]': decodeURI(req.body.topic),
    'discussion[body]': converter.makeHtml(decodeURI(req.body.body)).delNewlines(),
    'discussion[notify_via_email]': req.body.notifyViaEmail == 1 ? '[0, 1]' : 0, // == comparison, compares string to number
    'discussion[private]': req.body.privateMessage == 1 ? '[0, 1]' : 0, // API naming slightly changed, private is a reserved word in strict mode 
  };

  next();
};

/**
 * @description Craft an edited message from data 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 */
exports.craftMessage = (req, res, next) => {
  req.body = JSON.parse(req.headers['message-data'] || '{}');
  req.form = {
    'discussion[topic]': decodeURI(req.body.topic),
    'discussion[body]': converter.makeHtml(decodeURI(req.body.body)).delNewlines(),
  };

  next();
};

/**
 * @description Craft a new reply from data 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 */
exports.craftNewReply = (req, res, next) => {
  req.body = JSON.parse(req.headers['message-data'] || '{}');
  req.form = {
    'reply[body]': converter.makeHtml(decodeURI(req.body.body)).delNewlines(),
    'reply[notify_via_email]': req.notifyViaEmail == 1 ? '[0, 1]' : 0,
    'reply[private]': req.privateMessage == 1 ? '[0, 1]' : 0
  };

  if (req.params.subitemId) {
    req.url = req.url.replace(`/${req.params.subitemId}`, ''); // Here, form is sent to .../replies even if it is replied to a reply
    req.form['reply[parent_id]'] = req.params.subitemId;
  } 

  next();
};

/**
 * @description Craft an edited reply from data 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 */
exports.craftReply = (req, res, next) => {
  req.body = JSON.parse(req.headers['message-data'] || '{}');
  req.form = {
    'reply[body]': converter.makeHtml(decodeURI(req.body.body)).delNewlines()
  };

  next();
};

/**
 * @description Load notification list
 * @param {Object} req 
 * @param {Object} res 
 */
exports.loadNotifications = (req, res) => {
  res.append('Managebac-Data', JSON.stringify({
    notifications: parser.parseNotifications(req.document),
    numberOfPages: parser.parseNumberOfPages(req.document)
  }));

  res.status(200).end();
};

/**
 * @description Load single notification 
 * @param {Object} req 
 * @param {Object} res 
 */
exports.loadNotification = (req, res) => {
  res.append('Managebac-Data', JSON.stringify({
    notification: parser.parseNotification(req.document)
  }));

  res.status(200).end();
};

/**
 * @description Load CAS dashboard 
 * @param {Object} req 
 * @param {Object} res 
 */
exports.loadCas = (req, res) => {
  res.append('Managebac-Data', JSON.stringify({
    cas: parser.parseCas(req.document),
    documents: parser.parseDropbox(req.document)
  }));

  res.status(200).end();
};

/**
 * @description Load CAS experience 
 * @param {Object} req 
 * @param {Object} res 
 */
exports.loadExperience = (req, res) => {
  res.append('Managebac-Data', JSON.stringify({
    cas: Object.assign(parser.parseCas(req.document)[0], parser.parseExperience(req.document))
  }));

  res.status(200).end();
};

/**
 * @description Load CAS questions and answers 
 * @param {Object} req 
 * @param {Object} res 
 */
exports.loadAnswers = (req, res) => {
  res.append('Managebac-Data', JSON.stringify({
    answers: parser.parseAnswers(req.document)
  }));

  res.status(200).end();
};

/**
 * @description Craft CAS answers from data 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 */
exports.craftAnswers = (req, res, next) => {
  req.body = JSON.parse(req.headers['answers-data'] || '{}');
  req.form = {
    'cas_answers[answers[10195989]]': decodeURI(req.body.answers[0]), 
    'cas_answers[answers[10195990]]': decodeURI(req.body.answers[1]),
    'cas_answers[answers[10195991]]': decodeURI(req.body.answers[2])
  };

  req.url += '/update_answers'; // Here, form is sent to .../answers/update_answers

  next();
};

/**
 * @description Load CAS reflections 
 * @param {Object} req 
 * req must have a document property 
 * @param {Object} res 
 */
exports.loadReflections = (req, res) => {
  res.append('Managebac-Data', JSON.stringify({
    reflections: parser.parseReflections(req.document)
  }));

  res.status(200).end();
};

/**
 * @description Craft a new reflection from data 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 */
exports.craftNewReflection = (req, res, next) => {
  req.body = JSON.parse(req.headers['reflection-data'] || '{}');
  req.form = {
    'evidence[type]': 'JournalEvidence',
    'evidence[body]': converter.makeHtml(decodeURI(req.body.body)).delNewlines(),
    // 'evidence[educational_outcome_ids][]': req.body.educationalOutcomeIds
  };

  next();
};

/**
 * @description Craft an edited reflection from data
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 */
exports.craftReflection = (req, res, next) => {
  req.body = JSON.parse(req.headers['reflection-data'] || '{}');
  req.form = {
    'evidence[body]': converter.makeHtml(decodeURI(req.body.body)).delNewlines(),
    // 'evidence[educational_outcome_ids][]': req.body.educationalOutcomeIds
  };
  
  next();
};

/**
 * @description Load learning outcomes and ids from form data 
 * @param {Object} req 
 * @param {Object} res 
 */
exports.loadLearningOutcomes = (req, res) => {
  res.append('Managebac-Data', JSON.stringify({
    learningOutcomes: parser.parseLearningOutcomes(req.document)
  }));
  res.status(200).end();
};