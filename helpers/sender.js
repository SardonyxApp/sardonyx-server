/**
 * @fileoverview Abstraction to send POST/PATCH requests to send/edit content.
 * @author SardonyxApp
 * @license MIT 
 */

const request = require('request');
const { parseCSRFToken } = require('./parsers');

/**
 * @param {Object} req
 * req must contain form and token properties 
 * @param {Object} res 
 * @param {Function} next 
 */
module.exports = (req, res, next) => {
  console.log(req.url);
  // Set cookies 
  const j = request.jar();  
  j.setCookie(request.cookie(req.token.cfduid), 'https://kokusaiib.managebac.com');
  j.setCookie(request.cookie(req.token.managebacSession), 'https://kokusaiib.managebac.com');

  // Make request 
  request({
    url: req.url,
    // followAllRedirects: true,
    method: req.method.toLowerCase(),
    form: req.form || {}, // form empty for DELETE requests
    jar: j,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-CSRF-Token': req.token.csrfToken
    }
  }, (err, response) => {
    if (err) {
      console.error(err);
      res.status(502).end();
      return;
    }

    console.log(response);

    // Redirected url should be index 
    const matchUrl = req.params.destinationId ? req.url.replace(`/${req.params.destinationId}`, '') : req.url;
    // Successfully returned page
    if (response.statusCode === 200 && response.request.uri.href === matchUrl) {
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
}