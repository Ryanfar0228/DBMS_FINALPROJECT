const connection = require('../dbConnection');

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
