const express = require('express');
const router = express.Router();
const db = require('../dbConnection');

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
