/**
 * @fileoverview Helper functions used in authentication.
 * @author SardonyxApp
 * @license MIT
 */

const parser = require('./parsers');

/**
 * @description Create a Managebac URL
 * @param {String} resource 
 * resource can be any of the valid Managebac resources, like classes and groups
 * @param {String} destination 
 * destination can be any of the valid Managebac destinations, like assignments and messages
 * @example loadUrl('classes') with no parameters will GET /student/classes
 * @example loadUrl('classes') with req.params.resourceId will GET /student/classes/:classId
 * @example loadUrl('classes', 'assignments') without req.params.destinationId will GET /student/classes/:resourceId/assignments
 * @example loadUrl('classes', 'assignments') with req.params.destinationId will GET /student/classes/:resourceId/assignments/:destinationId
 */
exports.createUrl = (resource, destination) => {
  return (req, res, next) => {
    req.url = `https://kokusaiib.managebac.com/student`;
    if (resource && req.params.resourceId) {
      if (destination) {
        if (req.params.destinationId) req.url += `/${resource}/${req.params.resourceId}/${destination}/${req.params.destinationId}`;
        else req.url += `/${resource}/${req.params.resourceId}/${destination}`;
      } else {
        req.url += `/${resource}/${req.params.resourceId}`;
      }
    } else if (resource) {
      req.url += `/${resource}`;
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
    'discussion[topic]': req.body.topic,
    'discussion[body]': req.body.body,
    'discussion[notify_via_email]': req.body.notifyViaEmail,
    'discussion[private]': req.body.privateMessage, // API naming slightly changed, private is a reserved word in strict mode 
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