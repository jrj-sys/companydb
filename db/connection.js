const mysql = require('mysql2');


const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'pa$$word',
    database: 'companydb'
  });

module.exports = db;



