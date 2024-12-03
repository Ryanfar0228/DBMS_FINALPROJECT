const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./dbConnection'); // Import the database connection

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true })); // Parse form data
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

//*******************************************************************************
//*** Serve Main Page
//*******************************************************************************
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//*******************************************************************************
//*** Fetch LEGO Sets (GET)
//*******************************************************************************
app.get('/sets', (req, res) => {
  const query = 'SELECT set_num, name, year FROM sets LIMIT 10';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching sets:', err.message);
      return res.status(500).send('<p>Error fetching LEGO sets</p>');
    }

    // Generate HTML response
    let html = '<h1>LEGO Sets</h1><table border="1"><tr><th>Set Number</th><th>Name</th><th>Year</th></tr>';
    results.forEach((set) => {
      html += `<tr><td>${set.set_num}</td><td>${set.name}</td><td>${set.year}</td></tr>`;
    });
    html += '</table><br><a href="/">Back to Home</a>';

    res.send(html);
  });
});

//*******************************************************************************
//*** Search LEGO Parts (POST)
//*******************************************************************************
app.post('/search', (req, res) => {
  const { search } = req.body;
  const query = 'SELECT name, part_num FROM parts WHERE name LIKE ? LIMIT 10';

  db.query(query, [`%${search}%`], (err, results) => {
    if (err) {
      console.error('Error executing search:', err.message);
      return res.status(500).send('<p>Error during search</p>');
    }

    // Generate HTML response
    let html = `<h1>Search Results for "${search}"</h1><ul>`;
    results.forEach((part) => {
      html += `<li>${part.name} (Part Number: ${part.part_num})</li>`;
    });
    html += '</ul><br><a href="/">Back to Home</a>';

    res.send(html);
  });
});

//*******************************************************************************
//*** Start the Server
//*******************************************************************************
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
