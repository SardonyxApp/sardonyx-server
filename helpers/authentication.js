/**
 * @fileoverview Helper functions used in authentication.
 * @author SardonyxApp
 * @license MIT
 */

const request = require('request');
const parser = require('./parsers');

/**
 * @description Convert Login-Token header to req.body FormData
 * @param {Object} req 
 * req should have the header 'Login-Token'
 * @param {Object} res
 * @param {Function} next
 */
exports.createBody = (req, res, next) => {
  // Get the login token from header, otherwise set it to an empty object
  const credentials = JSON.parse(req.headers['login-token'] || '{}');

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
 * @description Convert Login-Token header to req.token
 * @param {Object} req 
 * req should have the header 'Login-Token'
 * @param {Object} res 
 * @param {FUnction} next 
 */
exports.createTokens = (req, res, next) => {
  const tokens = JSON.parse(req.headers['login-token'] || '{}');

  if (tokens.cfduid && tokens.managebacSession && tokens.authenticityToken) { 
    // All authentication properties are included 
    req.token = {
      cfduid: tokens.cfduid,
      managebacSession: tokens.managebacSession,
      authenticityToken: tokens.authenticityToken
    };

    next();
  } else if (req.method === 'GET' && tokens.cfduid && tokens.managebacSession) { 
    // GET requests do not need Authenticity Tokens
    req.token = {
      cfduid: tokens.cfduid,
      managebacSession: tokens.managebacSession,
    };

    next();
  } else {
    // The request did not contain token information, redirect them to reissue
    res.status(401).end();
  }
};

/**
 * @description Validate login in req.body using Managebac
 * @param {String} redir URL to redirect to upon failure, or the middleware will return 401
 */
exports.loginToManagebac = redir => {
  return (req, res, next) => {
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
      const _managebac_session = cookieJar.getCookieString('https://kokusaiib.managebac.com').split(';')[3];
      const login = req.body.login;
      const password = req.body.password; // Encrypt this in the future
      const payload = JSON.stringify({
        cfduid: __cfduid,
        managebacSession: _managebac_session,
        authenticityToken: parser.parseAuthenticityToken(response.body),
        login: login,
        password: password
      });
      res.append('Login-Token', payload);
      req.document = response.body;
      return next();
    }

      // Nonexistent or incorrect redirection, unauthorized
      if (redir) res.redirect(redir);
      else res.status(401).end();
    });
  };
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