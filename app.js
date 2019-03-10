const express = require('express');
const app = express();

const multer = require('multer');
const upload = multer(); // Used to parse multipart/form-data

require('dotenv').config(); // Used to parse .env

// Custom helper utilities 
const auth = require('./helpers/authentication');
const mb = require('./helpers/managebac');
const send = require('./helpers/sender');
const { end200 } = require('./helpers/helpers');

/**
 * Public 
 */

// Serve html files 
app.use(express.static('public'));

app.use('/favicon.ico', express.static(__dirname + '/public/Icon.png'));

/**
 * API
 */

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

/**
 * Managebac 
 */

// Initial validation
app.get('/api/validate', auth.createBody, auth.loginToManagebac(), mb.loadDefaults);

// Reissue tokens
app.get('/api/login', auth.createBody, auth.loginToManagebac(), end200);

// Initial login
// use upload.none() when it's only text fields
app.post('/api/login', upload.none(), auth.loginToManagebac(), auth.initiateStudent, mb.loadDefaults);

// Load dashboard 
app.get('/api/dashboard', auth.createTokens, mb.createUrl(), send, mb.loadDefaults);

// Load class
app.get('/api/class/:resourceId/overview', auth.createTokens, mb.createUrl('classes'), send, mb.loadOverview);
app.get('/api/class/:resourceId/assignments', auth.createTokens, mb.createUrl('classes', 'assignments'), send, mb.loadAssignments);
app.get('/api/class/:resourceId/messages', auth.createTokens, mb.createUrl('classes', 'discussions'), send, mb.loadMessages);

// Load group 
app.get('/api/group/:resourceId/overview', auth.createTokens, mb.createUrl('groups'), send, mb.loadOverview);
app.get('/api/group/:resourceId/messages', auth.createTokens, mb.createUrl('groups', 'discussions'), send, mb.loadMessages);

// Load assignment or event
app.get('/api/class/:resourceId/assignments/:subresourceId', auth.createTokens, mb.createUrl('classes', 'assignments'), send, mb.loadAssignment);
app.get('/api/event/:resourceId', auth.createTokens, mb.createUrl('ib/events'), send, mb.loadAssignment);
app.get('/api/class/:resourceId/events/:subresourceId', auth.createTokens, mb.createUrl('classes', 'events'), send, mb.loadAssignment);
app.get('/api/group/:resourceId/events/:subresourceId', auth.createTokens, mb.createUrl('groups', 'events'), send, mb.loadAssignment);

// Load message and replies  
app.get('/api/class/:resourceId/messages/:subresourceId', auth.createTokens, mb.createUrl('classes', 'discussions'), send, mb.loadMessage);
app.get('/api/group/:resourceId/messages/:subresourceId', auth.createTokens, mb.createUrl('groups', 'discussions'), send, mb.loadMessage);

// Load repies of reply 
app.get('/api/class/:resourceId/messages/:subresourceId/reply/:subitemId', auth.createTokens, mb.createUrl('classes', 'discussions', 'replies'), mb.craftRequestForReplyOfReply, send, mb.loadReplyOfReply);
app.get('/api/group/:resourceId/messages/:subresourceId/reply/:subitemId', auth.createTokens, mb.createUrl('groups', 'discussions', 'replies'), mb.craftRequestForReplyOfReply, send, mb.loadReplyOfReply);

// Send message 
app.post('/api/class/:resourceId/messages', auth.createTokens, mb.createUrl('classes', 'discussions'), mb.craftNewMessage, send, mb.loadMessages);
app.post('/api/group/:resourceId/messages', auth.createTokens, mb.createUrl('groups', 'discussions'), mb.craftNewMessage, send, mb.loadMessages);

// Edit message 
app.patch('/api/class/:resourceId/messages/:subresourceId', auth.createTokens, mb.createUrl('classes', 'discussions'), mb.craftMessage, send, mb.loadMessages);
app.patch('/api/group/:resourceId/messages/:subresourceId', auth.createTokens, mb.createUrl('groups', 'discussions'), mb.craftMessage, send, mb.loadMessages);

// Delete message 
app.delete('/api/class/:resourceId/messages/:subresourceId', auth.createTokens, mb.createUrl('classes', 'discussions'), send, mb.loadMessages);
app.delete('/api/group/:resourceId/messages/:subresourceId', auth.createTokens, mb.createUrl('groups', 'discussions'), send, mb.loadMessages);

// Send reply 
app.post('/api/class/:resourceId/messages/:subresourceId/reply', auth.createTokens, mb.createUrl('classes', 'discussions', 'replies'), mb.craftNewReply, send, end200);
app.post('/api/group/:resourceId/messages/:subresourceId/reply', auth.createTokens, mb.createUrl('groups', 'discussions', 'replies'), mb.craftNewReply, send, end200);

// Send reply to reply
app.post('/api/class/:resourceId/messages/:subresourceId/reply/:subitemId', auth.createTokens, mb.createUrl('classes', 'discussions', 'replies'), mb.craftNewReply, send, end200);
app.post('/api/group/:resourceId/messages/:subresourceId/reply/:subitemId', auth.createTokens, mb.createUrl('groups', 'discussions', 'replies'), mb.craftNewReply, send, end200);

// Edit reply 
app.patch('/api/class/:resourceId/messages/:subresourceId/reply/:subitemId', auth.createTokens, mb.createUrl('classes', 'discussions', 'replies'), mb.craftReply, send, end200);
app.patch('/api/group/:resourceId/messages/:subresourceId/reply/:subitemId', auth.createTokens, mb.createUrl('groups', 'discussions', 'replies'), mb.craftReply, send, end200);

// Delete reply 
app.delete('/api/class/:resourceId/messages/:subresourceId/reply/:subitemId', auth.createTokens, mb.createUrl('classes', 'discussions', 'replies'), send, end200);
app.delete('/api/group/:resourceId/messages/:subresourceId/reply/:subitemId', auth.createTokens, mb.createUrl('groups', 'discussions', 'replies'), send, end200);

// Load notifications 
app.get('/api/notification', auth.createTokens, mb.createUrl('notifications'), send, mb.loadNotifications);
app.get('/api/notification/:resourceId', auth.createTokens, mb.createUrl('notifications'), send, mb.loadNotification);

// CAS
app.get('/api/cas', auth.createTokens, mb.createUrl('ib/activity/cas'), send, mb.loadCas);
app.get('/api/cas/:resourceId/overview', auth.createTokens, mb.createUrl('ib/activity/cas'), send, mb.loadExperience);

// CAS Answers
app.get('/api/cas/:resourceId/answers', auth.createTokens, mb.createUrl('ib/activity/cas', 'answers'), send, mb.loadAnswers);
app.post('/api/cas/:resourceId/answers', auth.createTokens, mb.createUrl('ib/activity/cas', 'answers'), mb.craftAnswers, send, mb.loadAnswers);

// CAS Reflections
app.get('/api/cas/:resourceId/reflections', auth.createTokens, mb.createUrl('ib/activity/cas', 'reflections'), send, mb.loadReflections);
app.post('/api/cas/:resourceId/reflections', auth.createTokens, mb.createUrl('ib/activity/cas', 'reflections'), mb.craftNewReflection, send, mb.loadReflections);
app.patch('/api/cas/:resourceId/reflections/:subresourceId', auth.createTokens, mb.createUrl('ib/activity/cas', 'reflections'), mb.craftReflection, send, mb.loadReflections);
app.delete('/api/cas/:resourceId/reflections/:subresourceId', auth.createTokens, mb.createUrl('ib/activity/cas', 'reflections'), send, mb.loadReflections);
app.get('/api/cas/:resourceId/learning_outcomes', auth.createTokens, mb.createUrl('ib/activity/cas', 'reflections/new'), send, mb.loadLearningOutcomes);

/**
 * Sardonyx Web
 */

// Student login through web client
app.post('/login/student', upload.none(), auth.loginToManagebac('/login?invalid=true'), auth.initiateStudent, (req, res) => {
  res.redirect('/app');
});

// Teacher login through web client 
app.post('/login/teacher', upload.none(), (req, res) => {
  res.status(200).send('Teacher logins are not supported yet.');
});

module.exports = app;
// app.js and server.js are split for testing reasons