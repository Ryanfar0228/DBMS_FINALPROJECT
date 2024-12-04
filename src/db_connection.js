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