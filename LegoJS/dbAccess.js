//for database access import this connection

const connection = require('./dbConnection');

connection.query('SELECT * FROM parts', (err, results) => {
  if (err) throw err;
  console.log(results);
});
