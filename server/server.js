const express = require('express');
const app = express();

// Import routes
const authRoutes = require('./routes/auth');

// Middleware
app.use('/api', authRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`API is running on port ${port}`));
