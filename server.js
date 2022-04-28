const inquirer = require('inquirer');
const db = require('./db/connection.js');

// db.promise().query("QUERY")
// .then( ([rows, fields]) ) => {
//       console.log(rows);
// }) 
//   .catch(console.log)
//   .then( () => confirm.end());