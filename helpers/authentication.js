/**
 * @fileoverview Helper functions used in authentication.
 * @author SardonyxApp
 * @license MIT
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

require('dotenv').config();

const { users } = require('../models/users');

/**
 * @description Authenticates users 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 */
exports.initiateUser = (req, res, next) => {
  users.selectByEmail(req.body.login).then(results => {
    if (results.length) {
      bcrypt.compare(req.body.password, results[0].password_digest, (err, bool) => {
        if (bool) {
          // Valid account and correct password 
          const token = jwt.sign({
            id: results[0].id,
            email: req.body.login,
            tasklist: results[0].tasklist_id
          }, process.env.PRIVATE_KEY, {
            expiresIn: '1d',
          });

          if (req.type === 'api') {
            res.append('Sardonyx-Token', token);
          } else {
            res.cookie('Sardonyx-Token', token, {
              maxAge: 86400000, // expires in 28 days 
              secure: process.env.MODE === 'production', 
              httpOnly: true 
            });
          }

          next();
        } else {
          // Incorrect password 
          req.type === 'browser' ? res.redirect('/login?invalid=true') : res.status(401).send("Incorrect password");
        }
      });
    } else { 
      // Invalid account
      req.type === 'browser' ? res.redirect('/login?invalid=true') : res.status(401).send("Invalid account");
    }
  }).catch(err => {
    console.error(err);
    res.status(500).json({ error: 'There was an error accessing the database. ' + err });
  });
};

/**
 * @description Authenticates Sardonyx Tokens 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 */
exports.authenticateToken = (req, res, next) => {
  req.token = Object.assign(req.token || {}, jwt.decode(req.cookies['Sardonyx-Token'] || req.headers['sardonyx-token']));
  jwt.verify(req.cookies['Sardonyx-Token'] || req.headers['sardonyx-token'], process.env.PRIVATE_KEY, (err, decoded) => {
    if (err) { // Invalid or expired Sardonyx Token
      if (req.type === 'browser') res.redirect('/login');
      else res.status(401).json({ error: 'Sardonyx-Token is invalid or expired. ' + err });
    } else next();
  });
};

/**
 * @description Authenticates access to the requested tasklist 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next
 */
exports.authenticateTasklist = (req, res, next) => {
  if (req.query.tasklist) req.token.tasklist = req.query.tasklist;
  next();
};

/**
 * @description Clears cookies to log the user out 
 * @param {Object} req 
 * @param {Object} res 
 */
exports.logout = (req, res) => {
  res.clearCookie('Sardonyx-Token');
  res.redirect('/login?logout=true');
};

/**
 * @description Changes password
 * @param {Object} req 
 * @param {Object} res 
 */
exports.changePassword = (req, res) => {
  users.selectByEmail(req.token.email).then(results => {
    if (results.length) {
      // Match found
      bcrypt.compare(req.body.old_password, results[0].password_digest, (err, bool) => {
        if (bool) {
          // Correct old password
          users.updatePassword(req.token.email, req.body.new_password).then(r => {
            res.clearCookie('Sardonyx-Token');
            req.type === 'browser' ? res.redirect('/login?password=true') : res.status(200).send('Password changed successfuly');
          }).catch(err => {
            console.error(err);
            res.status(500).json({ error: 'There was an error while accessing the database. ' + err });
          });
        } else {
          res.redirect('/password?invalid=true');
        }
      });
    } else {
      res.redirect('/password?invalid=true');
    }
  });  
};