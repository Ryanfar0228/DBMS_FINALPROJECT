const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

require('dotenv').config();

// middleware
app.use(cors());
app.use(bodyParser.json());

// import routes
const partsRoutes = require('./routes/parts');
const setsRoutes = require('./routes/sets');
const themesRoutes = require('./routes/themes');

// use routes
app.use('/api/parts', partsRoutes);
app.use('/api/sets', setsRoutes);
app.use('/api/themes', themesRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
