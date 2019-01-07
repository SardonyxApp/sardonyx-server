/**
 * @fileoverview Helper functions used in authentication.
 * @author SardonyxApp
 * @license MIT
 */

const parser = require('./parsers');

/**
 * @description Create a Managebac URL (up to 3 layers)
 * @param {String} resource 
 * resource can be any of the valid Managebac resources, like classes and groups
 * @param {String} destination 
 * destination can be any of the valid Managebac destinations, like assignments and messages
 * @param {String} subitem 
 * @example createUrl('classes') with no parameters will return /students/classes
 * @example createUrl('classes') with :resouceId will return /student/classes/:classId
 * @example createUrl('classes', 'assignments') without :destinationId will return /student/classes/:resourceId/assignments
 * @example createUrl('classes', 'assignments') with params will return /student/classes/:resourceId/assignments/:destinationId
 * @example createUrl('classes', 'messages', 'replies') without :subitemId will return /student/classes/:resourceId/messages/:destinationId/replies
 * @example createUrl('classes', 'messages', 'replies') with params will return /student/classes/:resourceId/messages/:destinationId/replies/:subitemId
 */
exports.createUrl = (resource, destination, subitem) => {
  return (req, res, next) => {
    req.url = `https://kokusaiib.managebac.com/student`;

    // This is nasty, but it is more readable than a recursive function with its own recursive params 
    if (resource) {
      req.url += `/${resource}`

      if (req.params.resourceId) {
        req.url += `/${req.params.resourceId}`;

        if(destination) {
          req.url += `/${destination}`;

          if (req.params.destinationId) {
            req.url += `/${req.params.destinationId}`;

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
 * @description Craft a new message from data
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 */
exports.craftNewMessage = (req, res, next) => {
  req.body = JSON.parse(req.headers['message-data']);
  req.form = {
    'discussion[topic]': decodeURI(req.body.topic),
    'discussion[body]': decodeURI(req.body.body),
    'discussion[notify_via_email]': req.body.notifyViaEmail,
    'discussion[private]': req.body.privateMessage, // API naming slightly changed, private is a reserved word in strict mode 
  };

  next();
};

/**
 * @description Craft an edit message from data 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 */
exports.craftMessage = (req, res, next) => {
  req.body = JSON.parse(req.headers['message-data']);
  req.form = {
    'discussion[topic]': decodeURI(req.body.topic),
    'discussion[body]': decodeURI(req.body.body)
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
  req.body = JSON.parse(req.headers['message-data']);
  req.form = {
    'reply[body]': decodeURI(req.body.body),
    'reply[notify_via_email]': req.notifyViaEmail,
    'reply[private]': req.privateMessage
  };

  if (req.params.subitemId) {
    req.url = req.url.replace(`/${req.params.subitemId}`, ''); // Here, form is sent to .../replies 
    req.form['reply[parent_id]'] = req.params.subitemId;
  } 

  next();
};

/**
 * @description Craft an edit message from data 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 */
exports.craftReply = (req, res, next) => {
  req.body = JSON.parse(req.headers['message-data']);
  req.form = {
    'reply[body]': decodeURI(req.body.body)
  };

  next();
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
 * req must have a document property 
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
 * req must have a document property 
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
 * req must have a document property 
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
 * req must have a document property
 * @param {Object} res 
 */
exports.loadAssignment = (req, res) => {
  res.append('Managebac-Data', JSON.stringify({
    assignment: Object.assign(parser.parseDeadlines(req.document)[0], {
      details: parser.parseDetails(req.document),
      attachments: parser.parseAttachments(req.document),
      dropbox: parser.parseDropbox(req.document),
      messages: parser.parseMessages(req.document)
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
    message: parser.parseMessages(req.document)
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
    notifications: parser.parseNotifications(req.document),
    numberOfPages: parser.parseNumberOfPages(req.document)
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
    notification: parser.parseNotification(req.document)
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
    cas: parser.parseCas(req.document),
    documents: parser.parseDropbox(req.document)
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
    cas: Object.assign(parser.parseCas(req.document)[0], parser.parseExperience(req.document))
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
    answers: parser.parseAnswers(req.document)
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
    reflections: parser.parseReflections(req.document)
  }));

  res.status(200).end();
};