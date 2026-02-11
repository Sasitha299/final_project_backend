const express = require('express');
const cors = require('cors');

// Import Routes
const authRoutes = require('./routes/authRoutes'); // Handles Auth AND User CRUD
const trainRoutes = require('./routes/TrainRoute'); 
const newsRoutes = require('./routes/NewsRoute'); 
const localNewsRoutes = require('./routes/LocalNewsRoute'); 

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount Routes
app.use('/api/auth', authRoutes); // All user logic is now under /api/auth
app.use('/api/trains', trainRoutes);
app.use('/api/news', newsRoutes); 
app.use('/api/localnews', localNewsRoutes); 

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

module.exports = app;