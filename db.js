/**
 * @fileoverview Facilitate database connections.
 * @author SardonyxApp
 * @license MIT 
 */

const mysql = require('mysql');
require('dotenv').config();

const state = {
  pool: null
};

/**
 * @description Start a database pool 
 * @param {Function} callback 
 */
exports.connect = callback => {
  state.pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_LOGIN,
    passowrd: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  });
  
  callback();
};

/**
 * @description Use a pre-existing database pool
 * @returns Pool
 */
exports.get = () => state.pool;