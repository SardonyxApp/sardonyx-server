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
  // Set cookies 
  const j = request.jar();  
  j.setCookie(request.cookie(req.token.cfduid), 'https://kokusaiib.managebac.com');
  j.setCookie(request.cookie(req.token.managebacSession), 'https://kokusaiib.managebac.com');

  // Make request 
  request({
    url: req.url,
    // followAllRedirects: true,
    followAllRedirects: true,
    method: req.method,
    form: req.form || {}, // form empty for DELETE requests
    jar: j,
    headers: {
      'X-CSRF-Token': req.token.csrfToken,
      accept: '*/*'
    }
  }, (err, response) => {
    if (err) {
      console.error(err);
      res.status(502).end();
      return;
    }
    console.log(response);

    let option = (() => {
      if (response.statusCode === 401) return 1;
      if (response.statusCode === 404) return 0;

      // Process response for messages and reflections
      // Successful messages/reflections are redirected to index action
      if (response.request.uri.href === (req.params.subresourceId ? req.url.replace(`/${req.params.subresourceId}`, '') : req.url)) return 2;

      // Process response for answers 
      if (response.request.uri.href === req.url.replace('/update_answers', '')) return 2;

      // Process response for replies 
      if (/^\$discussion/.test(response.body)) {
        if (response.body.includes('has-error')) return 0;
        return 2;
      }

      return 0; // Nonexistent or invalid request 
    })();
    // 0 ... 400 Bad Request  
    // 1 ... 401 Unauthorized
    // 2 ... 200 OK

    // Successful requests
    if (option === 2) {
      // Return new tokens 
      const __cfduid = j.getCookieString('https://kokusaiib.managebac.com').split(';')[0];
      const _managebac_session = j.getCookieString('https://kokusaiib.managebac.com').split(';')[1];
      const payload = JSON.stringify({
        cfduid: __cfduid,
        managebacSession: _managebac_session,
        csrfToken: parseCSRFToken(response.body)
      });
      res.append('Login-Token', payload);

      // Append response HTML for parsing (only parsed when middleware is connected)
      req.document = response.body;

      return next();
    }

    // Nonexistent or invalid request 
    if (option === 1) res.status(401).end();
    else res.status(400).end(); 
  });
}