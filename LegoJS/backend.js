const express = require("express");
const app = express();
const port = 3000;


// Health check route (optional)
app.get('/', (req, res) => {
  res.send('API is working!');
});

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: "localhost", // Loaded from .env
  user: "root",
  password: "...",
  database: "LegoDB",
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Database connected!');
});

module.exports = connection; // Export the connection for use in other files


// Get all parts
exports.getAllParts = (req, res) => {
  const query = 'SELECT * FROM parts';
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

// Get part by ID
exports.getPartById = (req, res) => {
  const query = 'SELECT * FROM parts WHERE part_num = ?';
  connection.query(query, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results[0]);
  });
};

// Add a new part
exports.addPart = (req, res) => {
  const query = 'INSERT INTO parts (part_num, name, part_cat_id) VALUES (?, ?, ?)';
  const { part_num, name, part_cat_id } = req.body;
  connection.query(query, [part_num, name, part_cat_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Part added!', partId: results.insertId });
  });
};

// Update an existing part
exports.updatePart = (req, res) => {
  const query = 'UPDATE parts SET name = ?, part_cat_id = ? WHERE part_num = ?';
  const { name, part_cat_id } = req.body;
  connection.query(query, [name, part_cat_id, req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Part updated!' });
  });
};

// Delete a part
exports.deletePart = (req, res) => {
  const query = 'DELETE FROM parts WHERE part_num = ?';
  connection.query(query, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Part deleted!' });
  });
};

module.exports = router;

// GET all parts
router.get('/', (req, res) => {
  const query = 'SELECT * FROM parts';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching parts:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  });
});

// GET a single part by part_num
router.get('/:part_num', (req, res) => {
  const { part_num } = req.params;
  const query = 'SELECT * FROM parts WHERE part_num = ?';
  db.query(query, [part_num], (err, results) => {
    if (err) {
      console.error('Error fetching part:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Part not found' });
    }
    res.json(results[0]);
  });
});

// GET all sets
router.get('/', (req, res) => {
  const query = 'SELECT * FROM sets_abbrev';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching sets:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  });
});

// GET a single set by set_num
router.get('/:set_num', (req, res) => {
  const { set_num } = req.params;
  const query = 'SELECT * FROM sets_abbrev WHERE set_num = ?';
  db.query(query, [set_num], (err, results) => {
    if (err) {
      console.error('Error fetching set:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Set not found' });
    }
    res.json(results[0]);
  });
});

module.exports = router;

// GET all themes
router.get('/', (req, res) => {
  const query = 'SELECT * FROM themes';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching themes:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  });
});

// GET a single theme by theme_id
router.get('/:theme_id', (req, res) => {
  const { theme_id } = req.params;
  const query = 'SELECT * FROM themes WHERE theme_id = ?';
  db.query(query, [theme_id], (err, results) => {
    if (err) {
      console.error('Error fetching theme:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Theme not found' });
    }
    res.json(results[0]);
  });
});

module.exports = router;

/*
Forouraghi method
*/

const fs = require("fs");

function readAndServe(path, res)
{
    fs.readFile(path,function(err, data) {

        res.setHeader('Content-Type', 'text/html');
        res.end(data);
    })
}

//******************************************************************************
//*** receive the main page get requests from the client
//******************************************************************************
app.get("/search", function (req, res) {
    readAndServe("./search.html",res)   //uses directory structure

});


//******************************************************************************
//*** receive post register data from the client
//******************************************************************************
app.post("/search", function (req, res) {
    var desc = req.body.desc;   // extract the strings received from the browser

    var sql_query = "select title, description from film where description like '%" + desc + "%'";

    con.query(sql_query, function (err, result, fields) { // execute the SQL string
		if (err)
		    throw err;                  // SQL error

	    else {

                  //*** start creating the html body for the browser
			      var html_body = "<HTML><STYLE>body{font-family:arial}</STYLE>";
			      html_body = html_body + "<BODY><TABLE BORDER=1>";

			      //*** print column headings
			      html_body = html_body + "<TR>";
                 for (var i = 0; i < fields.length; i++)
				    html_body = html_body + ("<TH>" + fields[i].name.toUpperCase() + "</TH>");
				  html_body = html_body + "</TR>";

                  //*** prints rows of table data
				  for (var i = 0; i < result.length; i++)
				       html_body = html_body + ("<TR><TD>" + result[i].title + "</TD>" + "<TD>" + result[i].description + "</TD></TR>");

                  html_body = html_body + "</TABLE>";

				  //** finish off the html body with a link back to the search page
				  html_body = html_body + "<BR><BR><BR><a href=http://localhost:3000/search>Go Back To Search</a><BR><BR><BR>";
			      html_body = html_body + "</BODY></HTML>";

                console.log(html_body);             // send query results to the console
			    res.send(html_body);                // send query results back to the browser
	         }
    });
});
