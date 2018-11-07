const express = require('express');
const app = express();

const multer = require('multer');
const upload = multer(); // Used to parse multipart/form-data

const authRoutes = require('./routes/authentication');

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

// Initial validation
app.get('/api/validate', authRoutes.loginTokenToBody, authRoutes.loginToManagebac, (req, res) => {
  res.status(200).end();
});

// Reissue tokens
app.get('/api/login', authRoutes.loginTokenToBody, authRoutes.loginToManagebac, (req, res) => {
  res.status(200).end();
});

// Initial login
// use upload.none() when it's only text fields
app.post('/api/login', upload.none(), authRoutes.loginToManagebac, authRoutes.createSardonyxToken);

const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});