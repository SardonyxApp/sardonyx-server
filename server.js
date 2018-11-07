const express = require('express');
const app = express();

const multer = require('multer');
const upload = multer(); // Used to parse multipart/form-data

const request = require('request');

// Route to return a random response code of either 401 or 200
app.all('/random', (req, res) => {

  let random = Math.floor(Math.random() * 2); // Generate either 0 or 1
  res.sendStatus(random === 0 ? 401 : 200);

});

// Set general settings on all of the API routes
app.use('/api', (req, res, next) => {

  // Allow from all for now, for testing purposes
  res.set('Access-Control-Allow-Origin', '*');

  // Continue with processing the request
  next();

});


/**
 * @description Convert Login-Token header to req.body FormData
 * @param {Object} req
 * req should have the header 'Login-Token'
 * @param {Object} req
 * @param {Function} next
 */
const loginTokenToBody = (req, res, next) => {

  // Get the login token from header, otherwise set it to an empty dictionary
  const credentials = JSON.parse(req.headers['login-token'] || '{}') || {};

  if (credentials.login && credentials.password) {

    req.body = req.body || {}; // Define req.body in case of GET requests
    req.body.login = credentials.login;
    req.body.password = credentials.password;
    req.body.remember_me = '1';
    next();

  } else {

    // The request did not contain a login-token. Maybe they have not done an initial login yet?
    // Unauthorize them before sending useless requests
    res.sendStatus(401);

  }

};


/**
 * @description Validate login in req.body using Managebac
 * @param {Object} req 
 * req must have body containing keys 'login' and 'password'
 * @param {Object} res 
 */
const loginToManagebac = (req, res) => {
  
  let additionalFormData = {
    'remember_me': 1
  };

  // Relay POST request with 'login' and 'password' to ManageBac
  request.post({
    url: 'https://kokusaiib.managebac.com/sessions',
    form: {...req.body, ...additionalFormData} // Send combined data
  }, (err, response) => {

    if (err) {
      console.error(err);
      res.status(502).send('There was an error accessing Managebac.');
      return;
    }

    // ManageBac returns a 302 redirection from /sessions to /student on success
    // Check if the Destination is /student, then keep all the information to send back to client
    if (response.caseless.dict.location.includes('/student')) {

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
      res.sendStatus(200);
      return;

    }

    // No or incorrect redirection => unauthorized
    res.sendStatus(401);

  });
};

// Initial validation
app.get('/api/validate', loginTokenToBody, loginToManagebac);

// Reissue tokens
app.get('/api/login', loginTokenToBody, loginToManagebac);

// Initial login
app.post('/api/login', upload.none(), loginToManagebac); // use .none() when it's only text fields

const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
