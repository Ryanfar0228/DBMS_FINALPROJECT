const express = require('express');
const app = express();
const db = require('./dbConnection'); // Import the database connection

// Import route files
const partsRoutes = require('./routes/parts');
const setsRoutes = require('./routes/sets');
const themesRoutes = require('./routes/themes');

// Middleware to parse JSON
app.use(express.json());

// Use route handlers for different endpoints
app.use('/api/parts', partsRoutes);
app.use('/api/sets', setsRoutes);
app.use('/api/themes', themesRoutes);

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
