/**
 * @fileoverview Helper functions used in authentication.
 * @author SardonyxApp
 * @license MIT
 */

const request = require('request');

/**
 * @description Convert Login-Token header to req.body FormData
 * @param {Object} req should have the header 'Login-Token'
 * @param {Object} res
 * @param {Function} next
 */
exports.loginTokenToBody = (req, res, next) => {
  // Get the login token from header, otherwise set it to an empty object
  const credentials = JSON.parse(req.headers['login-token'] || '{}') || {};

  if (credentials.login && credentials.password) {
    req.body = req.body || {}; // Define req.body in case of GET requests
    req.body.login = credentials.login;
    req.body.password = credentials.password;
    next();
  } else {
    // The request did not contain a login-token, unauthorize them before sending useless requests
    res.status(401).end();
  }
};


/**
 * @description Validate login in req.body using Managebac
 * @param {Object} req Request with body containing keys 'login' and 'password'
 * @param {Object} res 
 * @param {Function} next
 */
exports.loginToManagebac = (req, res, next) => {
  const additionalFormData = {
    'remember_me': 1
  };

  // Relay POST request with 'login' and 'password' to ManageBac
  request.post({
    url: 'https://kokusaiib.managebac.com/sessions',
    form: { ...req.body, ...additionalFormData } // Combine data
  }, (err, response) => {
    if (err) {
      console.error(err);
      res.status(502).write('There was an error accessing Managebac.').end();
      return;
    }

    // ManageBac returns a 302 redirection from /sessions to /student on success
    // Check if the destination is /student, then keep all the information to send back to client
    if (response.caseless.dict.location && response.caseless.dict.location.includes('/student')) {
      const __cfdiud = response.headers['set-cookie'][0].split(';')[0];
      const _managebac_session = response.headers['set-cookie'][2].split(';')[0];
      const login = req.body.login;
      const password = req.body.password; // Encrypt this in the future
      const payload = JSON.stringify({
        cfdiud: __cfdiud,
        managebacSession: _managebac_session,
        login: login,
        password: password
      });
      res.append('Login-Token', payload);
      return next();
    }

    // Nonexistent or incorrect redirection, unauthorized
    res.status(401).end();
  });
};

/**
 * This middleware is only called if loginToManagebac was 200.
 * @description Creates a unique token and puts that in a DB.
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next
 */
exports.createSardonyxToken = (req, res, next) => {
  // Create token
  const token = 'temporary0123abcd'

  // Put token in DB
  // createDBEntry(req.body.login, token)

  // Return that token
  res.append('Sardonyx-Token', token);
  next();
};