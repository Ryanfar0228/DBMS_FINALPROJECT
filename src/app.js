//*** Team 4: Aidan Elm, Ryan Farley, Phil Kershner
//*** CSC 351
//*** 5 Dec 24
//*** Final Project | app.js | node js web server connecting lego site to sql database.

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./db_connection'); // Import the database connection

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({
    extended: true
})); // Parse form data
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
    const query = 'SELECT set_num, name, year FROM sets_abbrev LIMIT 10';

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
    const {
        search
    } = req.body;
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
//*** Create custom sets POST
//*******************************************************************************
app.post('/create-set', (req, res) => {
    const {
        set_name
    } = req.body; // Get the custom set name from the form
    const query = 'INSERT INTO custom_sets (name) VALUES (?)';

    db.query(query, [set_name], (err, result) => {
        if (err) {
            console.error('Error creating custom set:', err.message);
            return res.status(500).send('<p>Error creating custom set</p>');
        }

        res.send(`<p>Custom set "${set_name}" created successfully!</p><br><a href="/">Back to Home</a>`);
    });
});


//*******************************************************************************
//*** Add parts to set POST
//*******************************************************************************
app.post('/add-part', (req, res) => {
    const {
        set_id,
        part_num,
        quantity
    } = req.body; // Extract data from the form
    const query = 'INSERT INTO custom_set_parts (set_id, part_num, quantity) VALUES (?, ?, ?)';

    db.query(query, [set_id, part_num, quantity], (err, result) => {
        if (err) {
            console.error('Error adding part to custom set:', err.message);
            return res.status(500).send('<p>Error adding part to custom set</p>');
        }

        res.send(`<p>Part "${part_num}" added to set ID "${set_id}"!</p><br><a href="/">Back to Home</a>`);
    });
});


//*******************************************************************************
//*** Delete parts from set POST
//*******************************************************************************
app.post('/delete-part', (req, res) => {
    const {
        set_id,
        part_num
    } = req.body; // Extract data from the form
    const query = 'DELETE FROM custom_set_parts WHERE set_id = ? AND part_num = ?';

    db.query(query, [set_id, part_num], (err, result) => {
        if (err) {
            console.error('Error deleting part from custom set:', err.message);
            return res.status(500).send('<p>Error deleting part from custom set</p>');
        }

        res.send(`<p>Part "${part_num}" removed from set ID "${set_id}"!</p><br><a href="/">Back to Home</a>`);
    });
});


//*******************************************************************************
//*** Search set POST
//*******************************************************************************
app.post('/search-set', (req, res) => {
    const {
        search
    } = req.body; // Get search term
    const query = 'SELECT set_num, name, year FROM sets_abbrev WHERE name LIKE ? OR set_num LIKE ? LIMIT 10';

    db.query(query, [`%${search}%`, `%${search}%`], (err, results) => {
        if (err) {
            console.error('Error searching sets:', err.message);
            return res.status(500).send('<p>Error searching sets</p>');
        }

        // Generate HTML response
        let html = `<h1>Search Results for "${search}"</h1><table border="1">`;
        html += '<tr><th>Set Number</th><th>Name</th><th>Year</th></tr>';
        results.forEach((set) => {
            html += `<tr><td>${set.set_num}</td><td>${set.name}</td><td>${set.year}</td></tr>`;
        });
        html += '</table><br><a href="/">Back to Home</a>';

        res.send(html);
    });
});


//*******************************************************************************
//*** Start the Server
//*******************************************************************************
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
