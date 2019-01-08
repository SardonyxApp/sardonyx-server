/**
 * @fileoverview Abstraction to scrape any page from Managebac.
 * @author SardonyxApp
 * @license MIT 
 */

const request = require('request');
const { parseCSRFToken } = require('./parsers');

/**
 * @param {Object} req 
 * req must contain valid url and token properties 
 * @param {Object} res 
 * @param {Function} next 
 */
module.exports = (req, res, next) => {
  // Set cookies 
  const j = request.jar();
  j.setCookie(request.cookie(req.token.cfduid), 'https://kokusaiib.managebac.com');
  j.setCookie(request.cookie(req.token.managebacSession), 'https://kokusaiib.managebac.com');
  
  // Make request 
  request.get({
    url: req.url,
    jar: j,
  }, (err, response) => {
    if (err) {
      console.error(err);
      res.status(502).end();
      return;
    }

    // Successfully returned page 
    if (response.statusCode === 200 && response.request.uri.href === req.url) {
      // Return new tokens 
      const __cfduid = j.getCookieString('https://kokusaiib.managebac.com').split(';')[0];
      const _managebac_session = j.getCookieString('https://kokusaiib.managebac.com').split(';')[1];
      const payload = JSON.stringify({
        cfduid: __cfduid,
        managebacSession: _managebac_session,
        csrfToken: parseCSRFToken(response.body)
      });
      res.append('Login-Token', payload);

      // Append response HTML for parsing 
      req.document = response.body;
      
      return next();
    }

    //Nonexistent or invalid request, unauthorized 
    res.status(401).end();
  });
};