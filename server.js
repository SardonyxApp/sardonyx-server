const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});

const request = require('request');

/* SERVE STATIC FILES */
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

/* SERVE API */
app.use('/api', (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  //allow from all for now, for testing purposes
  next();
})

app.get('/api/web/validate', (req, res) => {
  res.sendStatus(200);
});

app.post('/api/web/login', urlencodedParser, (req, res) => {
  request.post({
    url: 'https://kokusaiib.managebac.com/sessions', 
    form: req.body
  }, (err, response, body) => {
    if (response.caseless.dict.location) res.status(200).redirect('../..');
    else res.status(401).redirect('../../login?invalid=true');
  });
});

const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
