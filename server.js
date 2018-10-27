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

app.get('/api/validate', (req, res) => {
  res.sendStatus(401);
  //invalidate all for now
});

app.post('/api/login', upload.array(), (req, res) => {
  request.post({
    url: 'https://kokusaiib.managebac.com/sessions',
    form: req.body
    //imitate client login
  }, (err, response, body) => {
    if (err) {
      console.error(err);
      res.status(503).send('There was an error accessing Managebac.');
    }

    //successfully received 302 redirection from /sessions to /student
    if (response.caseless.dict.location) {
      //extract necessary cookies from header to store on client
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
      res.status(200)
      res.append('Login-Token', payload);
      res.send();
    }

    else res.sendStatus(401);
  });
});

const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
