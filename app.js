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
app.get('/api/validate', auth.createBody, auth.loginToManagebac, mb.loadDefaults);

// Reissue tokens
app.get('/api/login', auth.createBody, auth.loginToManagebac, (req, res) => {
  res.status(200).end();
});

// Initial login
// use upload.none() when it's only text fields
app.post('/api/login', upload.none(), auth.loginToManagebac, auth.createSardonyxToken, mb.loadDefaults);

// Load class
app.get('/api/class/:resourceId/overview', auth.createTokens, mb.createUrl('classes'), mb.scrape, mb.loadOverview);
app.get('/api/class/:resourceId/assignments', auth.createTokens, mb.createUrl('classes', 'assignments'), mb.scrape, mb.loadAssignments);
app.get('/api/class/:resourceId/messages', auth.createTokens, mb.createUrl('classes', 'discussions'), mb.scrape, mb.loadMessages);

// Load group 
app.get('/api/group/:resourceId/overview', auth.createTokens, mb.createUrl('groups'), mb.scrape, mb.loadOverview);
app.get('/api/group/:resourceId/messages', auth.createTokens, mb.createUrl('groups', 'discussions'), mb.scrape, mb.loadMessages);

// Load assignment
app.get('/api/class/:resourceId/assignments/:destinationId', auth.createTokens, mb.createUrl('classes', 'assignments'), mb.scrape, mb.loadAssignment);

// Load message 
app.get('/api/class/:resourceId/messages/:destinationId', auth.createTokens, mb.createUrl('classes', 'discussions'), mb.scrape, mb.loadMessage);
app.get('/api/group/:resourceId/messages/:destinationId', auth.createTokens, mb.createUrl('groups', 'discussions'), mb.scrape, mb.loadMessage);

// Send message 
app.post('/api/class/:resourceId/messages', auth.createTokens, mb.createUrl('classes', 'discussions'), mb.sendMessage);
app.post('/api/group/:resourceId/messages', auth.createTokens, mb.createUrl('groups', 'discussions'), mb.sendMessage);

// Load notifications 
app.get('/api/notification', auth.createTokens, mb.createUrl('notifications'), mb.scrape, mb.loadNotifications);
app.get('/api/notification/:resourceId', auth.createTokens, mb.createUrl('notifications'), mb.scrape, mb.loadNotification);

// Load CAS
app.get('/api/cas', auth.createTokens, mb.createUrl('ib/activity/cas'), mb.scrape, mb.loadCas);
app.get('/api/cas/:resourceId', auth.createTokens, mb.createUrl('ib/activity/cas'), mb.scrape, mb.loadExperience);
app.get('/api/cas/:resourceId/answers', auth.createTokens, mb.createUrl('ib/activity/cas', 'answers'), mb.scrape, mb.loadAnswers);
app.get('/api/cas/:resourceId/reflections', auth.createTokens, mb.createUrl('ib/activity/cas', 'reflections'), mb.scrape, mb.loadReflections);

module.exports = app;
// app.js and server.js are split for testing reasons