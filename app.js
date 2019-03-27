/**
 * @fileoverview Manage routes for the Managebac parser, tasklist, and web pages.
 * @author SardonyxApp
 * @license MIT 
 */

const express = require('express');
const app = express();

const multer = require('multer');
const upload = multer(); // Used to parse multipart/form-data
const cookieParser = require('cookie-parser');
app.use(cookieParser());

require('dotenv').config(); // Used to parse .env

// Custom helper utilities 
const auth = require('./helpers/authentication');
const mb = require('./helpers/managebac');
const task = require('./helpers/tasklists');
const send = require('./helpers/sender');
const { end200 } = require('./helpers/helpers');

// Determine request type 
app.use((req, res, next) => {
  req.type = /^\/api/.test(req.path) ? 'api' : 'browser';
  next();
});

/**
 * Managebac API
 */

// Set general settings on all of the API routes
app.use('/api', (req, res, next) => {
  // Allow from all for now, for testing purposes
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

// Initial validation
app.get('/api/validate', auth.createBody, auth.loginToManagebac, mb.loadDefaults);

// Reissue tokens
app.get('/api/login', auth.createBody, auth.loginToManagebac, end200);

// Initial login
// use upload.none() when it's only text fields
app.post('/api/login', upload.none(), auth.loginToManagebac, auth.initiateStudent, mb.loadDefaults);

// Create tokens for all Managebac API requests
app.use('/api', auth.createTokens);

// Load dashboard 
app.get('/api/dashboard', mb.createUrl(), send, mb.loadDefaults);

// Load class
app.get('/api/class/:resourceId/overview', mb.createUrl('classes'), send, mb.loadOverview);
app.get('/api/class/:resourceId/assignments', mb.createUrl('classes', 'assignments'), send, mb.loadAssignments);
app.get('/api/class/:resourceId/messages', mb.createUrl('classes', 'discussions'), send, mb.loadMessages);

// Load group 
app.get('/api/group/:resourceId/overview', mb.createUrl('groups'), send, mb.loadOverview);
app.get('/api/group/:resourceId/messages', mb.createUrl('groups', 'discussions'), send, mb.loadMessages);

// Load assignment or event
app.get('/api/class/:resourceId/assignments/:subresourceId', mb.createUrl('classes', 'assignments'), send, mb.loadAssignment);
app.get('/api/event/:resourceId', mb.createUrl('ib/events'), send, mb.loadAssignment);
app.get('/api/class/:resourceId/events/:subresourceId', mb.createUrl('classes', 'events'), send, mb.loadAssignment);
app.get('/api/group/:resourceId/events/:subresourceId', mb.createUrl('groups', 'events'), send, mb.loadAssignment);

// Load message and replies  
app.get('/api/class/:resourceId/messages/:subresourceId', mb.createUrl('classes', 'discussions'), send, mb.loadMessage);
app.get('/api/group/:resourceId/messages/:subresourceId', mb.createUrl('groups', 'discussions'), send, mb.loadMessage);

// Load repies of reply 
app.get('/api/class/:resourceId/messages/:subresourceId/reply/:subitemId', mb.createUrl('classes', 'discussions', 'replies'), mb.craftRequestForReplyOfReply, send, mb.loadReplyOfReply);
app.get('/api/group/:resourceId/messages/:subresourceId/reply/:subitemId', mb.createUrl('groups', 'discussions', 'replies'), mb.craftRequestForReplyOfReply, send, mb.loadReplyOfReply);

// Send message 
app.post('/api/class/:resourceId/messages', mb.createUrl('classes', 'discussions'), mb.craftNewMessage, send, mb.loadMessages);
app.post('/api/group/:resourceId/messages', mb.createUrl('groups', 'discussions'), mb.craftNewMessage, send, mb.loadMessages);

// Edit message 
app.patch('/api/class/:resourceId/messages/:subresourceId', mb.createUrl('classes', 'discussions'), mb.craftMessage, send, mb.loadMessages);
app.patch('/api/group/:resourceId/messages/:subresourceId', mb.createUrl('groups', 'discussions'), mb.craftMessage, send, mb.loadMessages);

// Delete message 
app.delete('/api/class/:resourceId/messages/:subresourceId', mb.createUrl('classes', 'discussions'), send, mb.loadMessages);
app.delete('/api/group/:resourceId/messages/:subresourceId', mb.createUrl('groups', 'discussions'), send, mb.loadMessages);

// Send reply 
app.post('/api/class/:resourceId/messages/:subresourceId/reply', mb.createUrl('classes', 'discussions', 'replies'), mb.craftNewReply, send, end200);
app.post('/api/group/:resourceId/messages/:subresourceId/reply', mb.createUrl('groups', 'discussions', 'replies'), mb.craftNewReply, send, end200);

// Send reply to reply
app.post('/api/class/:resourceId/messages/:subresourceId/reply/:subitemId', mb.createUrl('classes', 'discussions', 'replies'), mb.craftNewReply, send, end200);
app.post('/api/group/:resourceId/messages/:subresourceId/reply/:subitemId', mb.createUrl('groups', 'discussions', 'replies'), mb.craftNewReply, send, end200);

// Edit reply 
app.patch('/api/class/:resourceId/messages/:subresourceId/reply/:subitemId', mb.createUrl('classes', 'discussions', 'replies'), mb.craftReply, send, end200);
app.patch('/api/group/:resourceId/messages/:subresourceId/reply/:subitemId', mb.createUrl('groups', 'discussions', 'replies'), mb.craftReply, send, end200);

// Delete reply 
app.delete('/api/class/:resourceId/messages/:subresourceId/reply/:subitemId', mb.createUrl('classes', 'discussions', 'replies'), send, end200);
app.delete('/api/group/:resourceId/messages/:subresourceId/reply/:subitemId', mb.createUrl('groups', 'discussions', 'replies'), send, end200);

// Load notifications 
app.get('/api/notification', mb.createUrl('notifications'), send, mb.loadNotifications);
app.get('/api/notification/:resourceId', mb.createUrl('notifications'), send, mb.loadNotification);

// CAS
app.get('/api/cas', mb.createUrl('ib/activity/cas'), send, mb.loadCas);
app.get('/api/cas/:resourceId/overview', mb.createUrl('ib/activity/cas'), send, mb.loadExperience);

// CAS Answers
app.get('/api/cas/:resourceId/answers', mb.createUrl('ib/activity/cas', 'answers'), send, mb.loadAnswers);
app.post('/api/cas/:resourceId/answers', mb.createUrl('ib/activity/cas', 'answers'), mb.craftAnswers, send, mb.loadAnswers);

// CAS Reflections
app.get('/api/cas/:resourceId/reflections', mb.createUrl('ib/activity/cas', 'reflections'), send, mb.loadReflections);
app.post('/api/cas/:resourceId/reflections', mb.createUrl('ib/activity/cas', 'reflections'), mb.craftNewReflection, send, mb.loadReflections);
app.patch('/api/cas/:resourceId/reflections/:subresourceId', mb.createUrl('ib/activity/cas', 'reflections'), mb.craftReflection, send, mb.loadReflections);
app.delete('/api/cas/:resourceId/reflections/:subresourceId', mb.createUrl('ib/activity/cas', 'reflections'), send, mb.loadReflections);
app.get('/api/cas/:resourceId/learning_outcomes', mb.createUrl('ib/activity/cas', 'reflections/new'), send, mb.loadLearningOutcomes);

/**
 * Sardonyx Web App
 */

app.use('/login', upload.none());

// Student login through web client
app.post('/login/student', auth.loginToManagebac, auth.initiateStudent, (req, res) => {
  res.redirect('/app');
});

// Teacher login through web client 
app.post('/login/teacher', auth.initiateTeacher, (req, res) => {
  res.redirect('/app');
});

app.get('/logout', auth.authenticateToken, auth.logout);

// Change password
app.use('/password', auth.authenticateToken, upload.none(), (req, res, next) => {
  if (!req.token.teacher) res.status(401).send('Students must change passwords through Managebac.');
  else next();
});
app.post('/password', auth.changePassword);

// Authenticate main page 
app.use('/app', auth.authenticateToken);

app.get('/app/user', task.loadUser);
app.delete('/app/task', task.deleteTask);
app.delete('/app/subjects', task.deleteLabel('subjects'));
app.delete('/app/categories', task.deleteLabel('categories'));

app.use('/app', auth.authenticateYear);

// Load data 
app.get('/app/tasklist', task.loadTasklist);
app.get('/app/tasks', task.loadTasks);
app.get('/app/subjects', task.loadLabel('subjects'));
app.get('/app/categories', task.loadLabel('categories'));

// Push data 
app.use('/app', express.json());

app.post('/app/task', task.craftTask, task.createTask);
app.patch('/app/task', task.craftTask, task.editTask);
app.post('/app/subjects', task.createLabel('subjects'));
app.post('/app/categories', task.createLabel('categories'));
app.patch('/app/subjects', task.updateLabel('subjects'));
app.patch('/app/categories', task.updateLabel('categories'));

/**
 * Public 
 */

// Serve html files 
app.use(express.static('public'));

app.use('/favicon.ico', express.static(__dirname + '/public/Icon.png'));

module.exports = app;
// app.js and server.js are split for testing reasons