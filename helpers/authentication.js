/**
 * @fileoverview Helper functions used in authentication.
 * @author SardonyxApp
 * @license MIT
 */

const request = require('request');
const parser = require('./parsers');

const students = require('../models/students');

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
    res.status(401).send('The request did not contain necessary credentials.');
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
    res.status(401).send('The request did not contain necessary credentials.');
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
        res.status(502).send('There was an error connecting to Managebac. ' + err);
        return;
      }

    // Successfully returns student page
    if (response.request.uri.href === 'https://kokusaiib.managebac.com/student') {
      // Store returned tokens 
      req.token = {
        cfduid: cookieJar.getCookieString('https://kokusaiib.managebac.com').split(';')[0],
        managebacSession: cookieJar.getCookieString('https://kokusaiib.managebac.com').split(';')[3]
      };

      const payload = JSON.stringify({
        cfduid: req.token.cfduid,
        managebacSession: req.token.managebacSession,
        authenticityToken: parser.parseAuthenticityToken(response.body),
        login: req.body.login,
        password: req.body.password
      });

      res.append('Login-Token', payload);
      req.document = response.body;
      return next();
    }

      // Nonexistent or incorrect redirection, unauthorized
      if (redir) res.redirect(redir);
      else res.status(401).send('The login was rejected by Managebac.');
    });
  };
};

/**
 * @description Handles initial sardonyx database operations for students
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next
 */
exports.initiateStudent = (req, res, next) => {
  // Check database to see if student already exists 
  students.selectByEmail(req.body.login).then(results => {
    // If student does not exist, create student 
    return new Promise((resolve, reject) => {
      if (!results.length) {
        // Set cookies 
        const j = request.jar();  
        j.setCookie(request.cookie(req.token.cfduid), 'https://kokusaiib.managebac.com');
        j.setCookie(request.cookie(req.token.managebacSession), 'https://kokusaiib.managebac.com');

        // Retrieve information about student and their cohort 
        request.get({
          url: 'https://kokusaiib.managebac.com/student/ib/members',
          jar: j
        }, (err, response) => {
          if (err) reject(err);
          
          // Store student information 
          const obj = Object.assign(parser.parseStudent(response.body), {
            email: req.body.login
          });

          students.create([obj.name, obj.email, obj.year, obj.tasklist_id]).then(rows => resolve(obj)).catch(e => reject(e));
        });
      } else resolve(results[0]);
    });
  }).then(results => {
    console.log(results);

    // Create token
    const token = 'temporary0123abcd'

    // Put token in DB
    // createDBEntry(req.body.login, token)

    // Return that token
    res.append('Sardonyx-Token', token);
    next();
  }).catch(err => {
    console.error(err);
    res.status(500).send('There was an error accessing the database.');
  });
};