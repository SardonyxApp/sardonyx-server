/**
 * @fileoverview Manage routes for the tasklist and web pages.
 * @author SardonyxApp
 * @license MIT 
 */

const express = require('express');
const app = express();

const multer = require('multer');
const upload = multer(); // Used to parse multipart/form-data
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const jwt = require('jsonwebtoken');

require('dotenv').config(); // Used to parse .env

// Custom helper utilities 
const auth = require('./helpers/authentication');
const task = require('./helpers/tasklists');

// Determine request type 
// req.type is necessary to distinguish users and test plugins
app.use((req, res, next) => {
  req.type = /^\/api/.test(req.path) ? 'api' : 'browser';
  if (!req.headers['user-agent'].match(/^Mozilla/)) req.type = 'api';
  next();
});

/**
 * Sardonyx Web App
 */

app.use('/login', upload.none());

app.post('/login', auth.initiateUser, (req, res) => {
  if (req.type === 'browser') {
    // First time users do not have cookies 
    if (!req.cookies['Sardonyx-Token']) {
      // Display the info window for first time users 
      res.redirect('/app?info=true');
    } else {
      res.redirect('/app');
    }
  } else {
    res.status(200).send("Login successful.");
  }
});

app.get('/logout', auth.authenticateToken, auth.logout);

// Change password
app.use('/password', auth.authenticateToken, upload.none());
app.post('/password', auth.changePassword);

// Authenticate 
app.use('/app', auth.authenticateToken, auth.authenticateTasklist);

app.get('/app/user', task.loadUser); // Tasklist can be specified for user too because of preferred labels
app.get('/app/tasklist', task.loadTasklist);
app.get('/app/tasks', task.loadTasks); // Append ?all=true to include past tasks as well and ?full=true to load tasks with related label info
app.get('/app/subjects', task.loadLabel('subjects'));
app.get('/app/categories', task.loadLabel('categories'));

app.delete('/app/task', task.deleteTask);
app.delete('/app/subjects', task.deleteLabel('subjects'));
app.delete('/app/categories', task.deleteLabel('categories'));

app.post('/app/user/subjects', task.changeUserLabel('subjects', 'add'));
app.delete('/app/user/subjects', task.changeUserLabel('subjects', 'delete'));
app.post('/app/user/categories', task.changeUserLabel('categories', 'add'));
app.delete('/app/user/categories', task.changeUserLabel('categories', 'delete'));
app.patch('/app/user/tasklist', task.changeDefaultTasklist);

// Data with JSON body 
app.use('/app', express.json());

app.post('/app/task', task.craftTask, task.createTask);
app.patch('/app/task', task.craftTask, task.updateTask);
app.post('/app/subjects', task.createLabel('subjects'));
app.post('/app/categories', task.createLabel('categories'));
app.patch('/app/subjects', task.updateLabel('subjects'));
app.patch('/app/categories', task.updateLabel('categories'));

/**
 * Public 
 */

app.get('/', (req, res, next) => {
  if (jwt.decode(req.cookies['Sardonyx-Token']) && req.query.redirect !== 'false') return res.redirect('/app');
  next();
});

// Serve html files 
app.use(express.static('public'));

app.use('/favicon.ico', express.static(__dirname + '/public/assets/Icon.png'));

module.exports = app;
// app.js and server.js are split for testing reasons