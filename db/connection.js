const inquirer = require('inquirer');
const mysql = require('mysql');
const consoleTable = require('console.table');
// needed to use async and await
const util = require('util');
const connection = mysql.createConnection({
    host: 'localhost',

    user: 'root',
    database: 'employees'
});


connection.connect(() => {
    console.log("db connected")
});

// util allows for node to utilize async and await capabilities vs callback methods
connection.query = util.promisify(connection.query)

//   //allows the connection to be exporte 
module.exports = connection;