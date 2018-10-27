const express = require('express');
const app = express();

const multer = require('multer');
const upload = multer();
//parse multipart/form-data

const request = require('request');

/* SERVE API */
app.use('/api', (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  //allow from all for now, for testing purposes
  next();
})

app.all('/random', (req, res) => {
  let random = Math.floor(Math.random() * 2);
  res.sendStatus(random === 0 ? 401 : 200); //return random response for testing
});

/**
 * @description Convert Login-Token header to req.body FormData
 * @param {Object} req
 * req should have header 'Login-Token'
 * @param {Object} req
 * @param {Function} next
 */
const loginTokenToBody = (req, res, next) => {
  const credentials = JSON.parse(req.headers['login-token'] || '{}') || {};
  if (credentials.login && credentials.password) {
    req.body = req.body || {}; //define req.body in case of GET requests
    req.body.login = credentials.login;
    req.body.password = credentials.password;
    req.body.remember_me = '1';
    next();
  } else {
    //unauthorize before sending useless requests
    res.sendStatus(401);
  }
};

/**
 * @description validate login in req.body using Managebac
 * @param {Object} req 
 * req must have body
 * @param {Object} res 
 * this is the final middlware
 */
const loginToManagebac = (req, res) => {
  request.post({
    url: 'https://kokusaiib.managebac.com/sessions',
    form: req.body
    //imitate client login
  }, (err, response) => {
    if (err) {
      console.error(err);
      res.status(503).send('There was an error accessing Managebac.');
    }

    //successfully received 302 redirection from /sessions to /student
    if (response.caseless.dict.location) {
      const __cfdiud = response.headers['set-cookie'][0].split(';')[0];
      const _managebac_session = response.headers['set-cookie'][2].split(';')[0];
      const login = req.body.login; 
      const password = req.body.password; //encrypt this in the future
      const payload = JSON.stringify({
        cfdiud: __cfdiud,
        managebacSession: _managebac_session,
        login: login,
        password: password
      });
      res.status(200);
      res.append('Login-Token', payload);
      res.send();
    }

    //no or incorrect redirection, unauthorized
    else res.sendStatus(401);
  });
};

app.get('/api/validate', loginTokenToBody, loginToManagebac);

app.post('/api/login', upload.array(), loginToManagebac);

const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
