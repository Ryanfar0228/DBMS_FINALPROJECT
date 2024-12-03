require('dotenv').config(); // Load environment variables from .env file
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST, // Loaded from .env
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Database connected!');
});

module.exports = connection; // Export the connection for use in other files
