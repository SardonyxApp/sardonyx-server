const express = require('express');
const app = express();

const fetch = require('node-fetch');

app.use(express.static('public'));

app.get('/validate', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.sendStatus(200);
});

const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
