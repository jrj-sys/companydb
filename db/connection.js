const mysql = require('mysql2');

// Connect to database and export (modularization)
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'pa$$word',
      database: 'election'
    });

module.exports = db;