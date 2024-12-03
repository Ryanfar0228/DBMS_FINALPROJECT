const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Replace w user
  password: '', // Replace w pw
  database: 'lego_db', // db name replace if needed
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Database connected!');
});

module.exports = connection; // Export the connection for use in other files
