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
  state.pool = process.env.MODE === 'production' 
    ? mysql.createPool({
	    socketPath: `/cloudsql/${process.env.DB_INSTANCE}`,
      user: process.env.DB_LOGIN,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      timezone: '+09:00'
    })
    : mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_LOGIN,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      timezone: '+09:00'
    });

  console.log(`Created pool. User: ${process.env.DB_LOGIN}@${process.env.DB_HOST || '%'} and Database: ${process.env.DB_DATABASE}`);

  callback();
};

/**
 * @description Use a pre-existing database pool
 * @returns Pool
 */
exports.get = () => state.pool;
