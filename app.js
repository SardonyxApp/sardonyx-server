const express = require('express');
const app = express();

const multer = require('multer');
const upload = multer(); // Used to parse multipart/form-data

require('dotenv').config(); // Used to parse .env

const auth = require('./helpers/authentication');

const end200 = (req, res) => {
  res.status(200).end();
};

app.use(express.static('public'));

// Route to return a random response code of either 401 or 200
app.all('/random', (req, res) => {
  const random = Math.floor(Math.random() * 2); // Generate either 0 or 1
  res.sendStatus(random === 0 ? 401 : 200);
});

// Set general settings on all of the API routes
app.use('/api', (req, res, next) => {
  // Allow from all for now, for testing purposes
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/api', end200);

// Initial validation
app.get('/api/validate', auth.loginTokenToBody, auth.loginToManagebac, end200);

// Reissue tokens
app.get('/api/login', auth.loginTokenToBody, auth.loginToManagebac, end200);

// Initial login
// use upload.none() when it's only text fields
app.post('/api/login', upload.none(), auth.loginToManagebac, auth.createSardonyxToken, end200);

module.exports = app;
// app.js and server.js are split for testing reasons