const express = require('express');
const app = express();

const multer = require('multer');
const upload = multer(); // Used to parse multipart/form-data

require('dotenv').config(); // Used to parse .env

// Custom helper utilities 
const auth = require('./helpers/authentication');
const mb = require('./helpers/managebac');
const scrape = require('./helpers/scraper');
const send = require('./helpers/sender');

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
app.get('/api/class/:resourceId/overview', auth.createTokens, mb.createUrl('classes'), scrape, mb.loadOverview);
app.get('/api/class/:resourceId/assignments', auth.createTokens, mb.createUrl('classes', 'assignments'), scrape, mb.loadAssignments);
app.get('/api/class/:resourceId/messages', auth.createTokens, mb.createUrl('classes', 'discussions'), scrape, mb.loadMessages);

// Load group 
app.get('/api/group/:resourceId/overview', auth.createTokens, mb.createUrl('groups'), scrape, mb.loadOverview);
app.get('/api/group/:resourceId/messages', auth.createTokens, mb.createUrl('groups', 'discussions'), scrape, mb.loadMessages);

// Load assignment
app.get('/api/class/:resourceId/assignments/:destinationId', auth.createTokens, mb.createUrl('classes', 'assignments'), scrape, mb.loadAssignment);

// Load message 
app.get('/api/class/:resourceId/messages/:destinationId', auth.createTokens, mb.createUrl('classes', 'discussions'), scrape, mb.loadMessage);
app.get('/api/group/:resourceId/messages/:destinationId', auth.createTokens, mb.createUrl('groups', 'discussions'), scrape, mb.loadMessage);

// Send message 
app.post('/api/class/:resourceId/messages', auth.createTokens, mb.createUrl('classes', 'discussions'), mb.craftNewMessage, send, mb.loadMessages);
app.post('/api/group/:resourceId/messages', auth.createTokens, mb.createUrl('groups', 'discussions'), mb.craftNewMessage, send, mb.loadMessages);

// Load notifications 
app.get('/api/notification', auth.createTokens, mb.createUrl('notifications'), scrape, mb.loadNotifications);
app.get('/api/notification/:resourceId', auth.createTokens, mb.createUrl('notifications'), scrape, mb.loadNotification);

// Load CAS
app.get('/api/cas', auth.createTokens, mb.createUrl('ib/activity/cas'), scrape, mb.loadCas);
app.get('/api/cas/:resourceId', auth.createTokens, mb.createUrl('ib/activity/cas'), scrape, mb.loadExperience);
app.get('/api/cas/:resourceId/answers', auth.createTokens, mb.createUrl('ib/activity/cas', 'answers'), scrape, mb.loadAnswers);
app.get('/api/cas/:resourceId/reflections', auth.createTokens, mb.createUrl('ib/activity/cas', 'reflections'), scrape, mb.loadReflections);

module.exports = app;
// app.js and server.js are split for testing reasons