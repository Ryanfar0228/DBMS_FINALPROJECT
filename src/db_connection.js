//*** Team 4: Aidan Elm, Ryan Farley, Phil Kershner
//*** CSC 351
//*** 5 Dec 24
//*** Final Project db_connection.js | node js webserver connection and login to sql db



const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // MySQL username
    password: 'toor', // MySQL password
    database: 'LegoDB', // Database name
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
        process.exit(1);
    }
    console.log('Connected to the LegoDB database.');
});

module.exports = db;
