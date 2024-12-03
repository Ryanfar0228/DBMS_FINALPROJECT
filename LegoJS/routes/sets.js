const express = require('express');
const router = express.Router();
const db = require('../dbConnection');

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
