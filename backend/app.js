const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const trainRoutes = require('./routes/TrainRoute'); 
const newsRoutes = require('./routes/NewsRoute'); 
const localNewsRoutes = require('./routes/LocalNewsRoute'); // <--- ADDED IMPORT

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trains', trainRoutes);
app.use('/api/news', newsRoutes); 
app.use('/api/localnews', localNewsRoutes); // <--- ADDED ROUTE USE

// Error Handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

module.exports = app;