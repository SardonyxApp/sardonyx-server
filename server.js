const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const request = require('request');

const jwt = require('jsonwebtoken');

/* SERVE API */
app.use('/api', (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  //allow from all for now, for testing purposes
  next();
})

app.get('/api/validate', (req, res) => {
  res.sendStatus(401);
  //invalidate all for now
});

app.post('/api/login', urlencodedParser, (req, res) => {
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
      const payload = {
        "Cookie": __cfdiud + '; ' + _managebac_session,
        "iss": "sardonyx-server",
        "sub": req.body.login,
      };
      jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: '30d'
      }, (err, token) => {
        if (err) {
          console.error(err);
          res.status(503).send('There was an error in authentication.');
        }
        res.set('set-cookie', `authorization_token=${token}; Expires=${new Date(Date.now() + 2592000000)}; Path="/"; Secure; HttpOnly; SameSite=Strict`);
        res.status(200).redirect('../..');
      });
    }

    else res.status(401).redirect('../../login?invalid=true');
  });
});

const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
