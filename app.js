const express = require('express');
const app = express();

const multer = require('multer');
const upload = multer(); // Used to parse multipart/form-data

require('dotenv').config(); // Used to parse .env

const auth = require('./helpers/authentication');
const mb = require('./helpers/managebac');

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
app.get('/api/validate', auth.loginTokenToBody, auth.loginToManagebac, mb.loadDefaults, end200);

// Reissue tokens
app.get('/api/login', auth.loginTokenToBody, auth.loginToManagebac, end200);

// Initial login
// use upload.none() when it's only text fields
app.post('/api/login', upload.none(), auth.loginToManagebac, auth.createSardonyxToken, mb.loadDefaults, end200);

// Load class
app.get('/api/class/:resourceId/overview', auth.loginTokenToCookie, auth.getResource('classes'), mb.loadOverview, end200);
app.get('/api/class/:resourceId/assignments', auth.loginTokenToCookie, auth.getResource('classes', 'assignments'), mb.loadAssignments, end200);
app.get('/api/class/:resourceId/messages', auth.loginTokenToCookie, auth.getResource('classes', 'discussions'), mb.loadMessages, end200);

// Load group 
app.get('/api/group/:resourceId/overview', auth.loginTokenToCookie, auth.getResource('groups'), mb.loadOverview, end200);
app.get('/api/group/:resourceId/messages', auth.loginTokenToCookie, auth.getResource('groups', 'discussions'), mb.loadMessages, end200);

// Load assignment
app.get('/api/class/:resourceId/assignments/:destinationId', auth.loginTokenToCookie, auth.getResource('classes', 'assignments'), mb.loadAssignment, end200);

// Load message 
app.get('/api/class/:resourceId/messages/:destinationId', auth.loginTokenToCookie, auth.getResource('classes', 'discussions'), mb.loadMessage, end200);
app.get('/api/group/:resourceId/messages/:destinationId', auth.loginTokenToCookie, auth.getResource('groups', 'discussions'), mb.loadMessage, end200);

// Load notifications 
app.get('/api/notification', auth.loginTokenToCookie, auth.getResource('notifications'), mb.loadNotifications, end200);
app.get('/api/notification/:resourceId', auth.loginTokenToCookie, auth.getResource('notifications'), end200);
module.exports = app;
// app.js and server.js are split for testing reasons