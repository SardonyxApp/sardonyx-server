const mysql = require('mysql');

require('dotenv').config();

const connection = mysql.createConnection({
  // host: process.env.DB_HOST,
  // user: process.env.DB_LOGIN,
  // passowrd: process.env.DB_PASSWORD
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'sardonyx'
});

connection.connect(err => {
  if (err) throw err;
  console.log('connected');
});