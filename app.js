const express = require('express');
const app = express();

const multer = require('multer');
const upload = multer(); // Used to parse multipart/form-data

require('dotenv').config(); // Used to parse .env

const auth = require('./helpers/authentication');
const mb = require('./helpers/managebac');

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

// Initial validation
app.get('/api/validate', auth.tokenToBody, auth.loginToManagebac, mb.loadDefaults);

// Reissue tokens
app.get('/api/login', auth.tokenToBody, auth.loginToManagebac, (req, res) => {
  res.status(200).end();
});

// Initial login
// use upload.none() when it's only text fields
app.post('/api/login', upload.none(), auth.loginToManagebac, auth.createSardonyxToken, mb.loadDefaults);

// Load class
app.get('/api/class/:resourceId/overview', auth.tokenToCookie, auth.loadUrl('classes'), auth.retrieve, mb.loadOverview);
app.get('/api/class/:resourceId/assignments', auth.tokenToCookie, auth.loadUrl('classes', 'assignments'), auth.retrieve, mb.loadAssignments);
app.get('/api/class/:resourceId/messages', auth.tokenToCookie, auth.loadUrl('classes', 'discussions'), auth.retrieve, mb.loadMessages);

// Load group 
app.get('/api/group/:resourceId/overview', auth.tokenToCookie, auth.loadUrl('groups'), auth.retrieve, mb.loadOverview);
app.get('/api/group/:resourceId/messages', auth.tokenToCookie, auth.loadUrl('groups', 'discussions'), auth.retrieve, mb.loadMessages);

// Load assignment
app.get('/api/class/:resourceId/assignments/:destinationId', auth.tokenToCookie, auth.loadUrl('classes', 'assignments'), auth.retrieve, mb.loadAssignment);

// Load message 
app.get('/api/class/:resourceId/messages/:destinationId', auth.tokenToCookie, auth.loadUrl('classes', 'discussions'), auth.retrieve, mb.loadMessage);
app.get('/api/group/:resourceId/messages/:destinationId', auth.tokenToCookie, auth.loadUrl('groups', 'discussions'), auth.retrieve, mb.loadMessage);

// Load notifications 
app.get('/api/notification', auth.tokenToCookie, auth.loadUrl('notifications'), auth.retrieve, mb.loadNotifications);
app.get('/api/notification/:resourceId', auth.tokenToCookie, auth.loadUrl('notifications'), auth.retrieve, mb.loadNotification);

// Load CAS
app.get('/api/cas', auth.tokenToCookie, auth.loadUrl('ib/activity/cas'), auth.retrieve, mb.loadCas);
app.get('/api/cas/:resourceId', auth.tokenToCookie, auth.loadUrl('ib/activity/cas'), auth.retrieve, mb.loadExperience);
app.get('/api/cas/:resourceId/answers', auth.tokenToCookie, auth.loadUrl('ib/activity/cas', 'answers'), auth.retrieve, mb.loadAnswers);
app.get('/api/cas/:resourceId/reflections', auth.tokenToCookie, auth.loadUrl('ib/activity/cas', 'reflections'), auth.retrieve, mb.loadReflections);

module.exports = app;
// app.js and server.js are split for testing reasons