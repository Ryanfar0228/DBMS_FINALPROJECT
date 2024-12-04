//*** Team 4: Aidan Elm, Ryan Farley, Phil Kershner
//*** CSC 351
//*** 5 Dec 24
//*** Final Project app.js | node js webserver and functions

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./db_connection');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Validation middleware
const validateInput = {
    // Validate search input
    searchInput: (input) => {
        if (!input || input.trim() === '') {
            throw new Error('Search input cannot be empty');
        }
        if (input.length > 100) {
            throw new Error('Search input is too long (max 100 characters)');
        }
        // Prevent potential SQL injection by allowing only alphanumeric, spaces, and some special characters
        const sanitizedInput = input.replace(/[^a-zA-Z0-9\s-]/g, '');
        return sanitizedInput;
    },

    // Validate set name
    setName: (name) => {
        if (!name || name.trim() === '') {
            throw new Error('Set name cannot be empty');
        }
        if (name.length > 255) {
            throw new Error('Set name is too long (max 255 characters)');
        }
        // Sanitize input to prevent potential injection
        const sanitizedName = name.replace(/[<>]/g, '').trim();
        return sanitizedName;
    },

    // Validate part addition
    partAddition: (setId, partNum, quantity) => {
        if (!setId || isNaN(parseInt(setId))) {
            throw new Error('Invalid set ID');
        }
        if (!partNum || partNum.trim() === '') {
            throw new Error('Part number cannot be empty');
        }
        if (!quantity || isNaN(parseInt(quantity)) || parseInt(quantity) <= 0) {
            throw new Error('Quantity must be a positive number');
        }
        return {
            setId: parseInt(setId),
            partNum: partNum.trim(),
            quantity: parseInt(quantity)
        };
    }
};

// Error handling middleware
const handleDatabaseError = (res, err, customMessage = 'Database operation failed') => {
    console.error(customMessage, err);
    res.status(500).send(`
        <p>${customMessage}</p>
        <p>Error details: ${err.message}</p>
        <br>
        <a href="/">Back to Home</a>
    `);
};

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
            return handleDatabaseError(res, err, 'Error fetching LEGO sets');
        }

        if (!results || results.length === 0) {
            return res.status(404).send('<p>No sets found</p><br><a href="/">Back to Home</a>');
        }

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
    try {
        const search = validateInput.searchInput(req.body.search);
        const query = 'SELECT name, part_num FROM parts WHERE name LIKE ? LIMIT 10';

        db.query(query, [`%${search}%`], (err, results) => {
            if (err) {
                return handleDatabaseError(res, err, 'Error executing search');
            }

            if (!results || results.length === 0) {
                return res.send(`<h1>Search Results for "${search}"</h1><p>No parts found</p><br><a href="/">Back to Home</a>`);
            }

            let html = `<h1>Search Results for "${search}"</h1><ul>`;
            results.forEach((part) => {
                html += `<li>${part.name} (Part Number: ${part.part_num})</li>`;
            });
            html += '</ul><br><a href="/">Back to Home</a>';

            res.send(html);
        });
    } catch (error) {
        res.status(400).send(`<p>Invalid search input: ${error.message}</p><br><a href="/">Back to Home</a>`);
    }
});

//*******************************************************************************
//*** Create custom sets POST
//*******************************************************************************
app.post('/create-set', (req, res) => {
    try {
        const set_name = validateInput.setName(req.body.set_name);
        const query = 'INSERT INTO custom_sets (name) VALUES (?)';

        db.query(query, [set_name], (err, result) => {
            if (err) {
                return handleDatabaseError(res, err, 'Error creating custom set');
            }

            res.send(`<p>Custom set "${set_name}" created successfully!</p><br><a href="/">Back to Home</a>`);
        });
    } catch (error) {
        res.status(400).send(`<p>Invalid set name: ${error.message}</p><br><a href="/">Back to Home</a>`);
    }
});

//*******************************************************************************
//*** Add parts to set POST
//*******************************************************************************
app.post('/add-part', (req, res) => {
    try {
        const { set_id, part_num, quantity } = validateInput.partAddition(
            req.body.set_id, 
            req.body.part_num, 
            req.body.quantity
        );

        const query = 'INSERT INTO custom_set_parts (set_id, part_num, quantity) VALUES (?, ?, ?)';

        db.query(query, [set_id, part_num, quantity], (err, result) => {
            if (err) {
                return handleDatabaseError(res, err, 'Error adding part to custom set');
            }

            res.send(`<p>Part "${part_num}" added to set ID "${set_id}"!</p><br><a href="/">Back to Home</a>`);
        });
    } catch (error) {
        res.status(400).send(`<p>Invalid part addition: ${error.message}</p><br><a href="/">Back to Home</a>`);
    }
});

//*******************************************************************************
//*** Delete parts from set POST
//*******************************************************************************
app.post('/delete-part', (req, res) => {
    try {
        const set_id = parseInt(req.body.set_id);
        const part_num = validateInput.searchInput(req.body.part_num);

        if (isNaN(set_id)) {
            throw new Error('Invalid set ID');
        }

        const query = 'DELETE FROM custom_set_parts WHERE set_id = ? AND part_num = ?';

        db.query(query, [set_id, part_num], (err, result) => {
            if (err) {
                return handleDatabaseError(res, err, 'Error deleting part from custom set');
            }

            if (result.affectedRows === 0) {
                return res.status(404).send(`<p>Part "${part_num}" not found in set ID "${set_id}"</p><br><a href="/">Back to Home</a>`);
            }

            res.send(`<p>Part "${part_num}" removed from set ID "${set_id}"!</p><br><a href="/">Back to Home</a>`);
        });
    } catch (error) {
        res.status(400).send(`<p>Invalid part deletion: ${error.message}</p><br><a href="/">Back to Home</a>`);
    }
});

//*******************************************************************************
//*** Search set POST
//*******************************************************************************
app.post('/search-set', (req, res) => {
    try {
        const search = validateInput.searchInput(req.body.search);
        const query = 'SELECT set_num, name, year FROM sets_abbrev WHERE name LIKE ? OR set_num LIKE ? LIMIT 10';

        db.query(query, [`%${search}%`, `%${search}%`], (err, results) => {
            if (err) {
                return handleDatabaseError(res, err, 'Error searching sets');
            }

            if (!results || results.length === 0) {
                return res.send(`<h1>Search Results for "${search}"</h1><p>No sets found</p><br><a href="/">Back to Home</a>`);
            }

            let html = `<h1>Search Results for "${search}"</h1><table border="1">`;
            html += '<tr><th>Set Number</th><th>Name</th><th>Year</th></tr>';
            results.forEach((set) => {
                html += `<tr><td>${set.set_num}</td><td>${set.name}</td><td>${set.year}</td></tr>`;
            });
            html += '</table><br><a href="/">Back to Home</a>';

            res.send(html);
        });
    } catch (error) {
        res.status(400).send(`<p>Invalid set search: ${error.message}</p><br><a href="/">Back to Home</a>`);
    }
});

//*******************************************************************************
//*** Start the Server
//*******************************************************************************
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});