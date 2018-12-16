/**
 * @fileoverview Helper functions used in authentication.
 * @author SardonyxApp
 * @license MIT
 */

const request = require('request');

/**
 * @description Convert Login-Token header to req.body FormData
 * @param {Object} req 
 * req should have the header 'Login-Token'
 * @param {Object} res
 * @param {Function} next
 */
exports.loginTokenToBody = (req, res, next) => {
  // Get the login token from header, otherwise set it to an empty object
  const credentials = JSON.parse(req.headers['login-token'] || '{}') || {};

  if (credentials.login && credentials.password) {
    req.body = {
      login: credentials.login,
      password: credentials.password
    };

    next();
  } else {
    // The request did not contain a login-token, unauthorize them before sending useless requests
    res.status(401).end();
  }
};

/**
 * @description Conver Login-Token header to req.cookie 
 * @param {Object} req 
 * req should have the header 'Login-Token'
 * @param {Object} res 
 * @param {FUnction} next 
 */
exports.loginTokenToCookie = (req, res, next) => {
  const cookies = JSON.parse(req.headers['login-token'] || '{}') || {};

  if (cookies.cfduid && cookies.managebacSession) {
    req.cookie = {
      cfduid: cookies.cfduid,
      managebacSession: cookies.managebacSession
    };
    
    next();
  } else {
    // The request did not contain cookie information, redirect them to reissue
    res.redirect('/api/login/');
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
  const cookieJar = request.jar();

  // Relay POST request with 'login' and 'password' to ManageBac
  request.post({
    url: 'https://kokusaiib.managebac.com/sessions',
    form: { ...req.body, ...additionalFormData },
    jar: cookieJar,
    followAllRedirects: true,
  }, (err, response) => {
    if (err) {
      console.error(err);
      res.status(502).end();
      return;
    }

    // Successfully returns student page
    if (response.request.uri.href === 'https://kokusaiib.managebac.com/student') {
      const __cfduid = cookieJar.getCookieString('https://kokusaiib.managebac.com').split(';')[0];
      const _managebac_session = cookieJar.getCookieString('https://kokusaiib.managebac.com').split(';')[2];
      const login = req.body.login;
      const password = req.body.password; // Encrypt this in the future
      const payload = JSON.stringify({
        cfduid: __cfduid,
        managebacSession: _managebac_session,
        login: login,
        password: password
      });
      res.append('Login-Token', payload);
      req.document = response.body;
      return next();
    }

    // Nonexistent or incorrect redirection, unauthorized
    res.status(401).end();
  });
};

/**
 * @description Retrieve /class/:classId from Managebac 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 */
exports.getClass = (req, res, next) => {
  const j = request.jar(); // Cookie jar 
  j.setCookie(request.cookie(req.cookie.cfduid), 'https://kokusaiib.managebac.com');
  j.setCookie(request.cookie(req.cookie.managebacSession), 'https://kokusaiib.managebac.com');

  request.get({
    url: `https://kokusaiib.managebac.com/student/classes/${req.params.classId}`,
    jar: j,
  }, (err, response) => {
    if (err) {
      console.error(err);
      res.status(502).end();
      return;
    }
    // Successfully returns class page 
    if (response.request.uri.href === `https://kokusaiib.managebac.com/student/classes/${req.params.classId}`) {
      const __cfduid = j.getCookieString('https://kokusaiib.managebac.com').split(';')[0];
      const _managebac_session = j.getCookieString('https://kokusaiib.managebac.com').split(';')[2];
      const payload = JSON.stringify({
        cfduid: __cfduid,
        managebacSession: _managebac_session
      });
      res.append('Login-Token', payload);
      res.document = response.body;
      return next();
    }

    //Nonexistent or invalid request, unauthorized 
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