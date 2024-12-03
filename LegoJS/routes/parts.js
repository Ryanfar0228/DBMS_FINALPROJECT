const express = require('express');
const router = express.Router();
const db = require('../dbConnection'); // Import database connection

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

module.exports = router;
