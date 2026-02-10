const mongoose = require('mongoose');

const trainSchema = new mongoose.Schema({
    trainNumber: {
        type: String,
        required: [true, 'Please add a Train Number'],
        unique: true,
        trim: true
    },
    trainName: {
        type: String,
        required: [true, 'Please add a Train Name'],
        trim: true
    },
    departureTime: {
        type: String,
        required: [true, 'Please add a Departure Time']
    },
    // Changed from 'departureStation' to 'departure'
    departure: {
        type: String,
        required: [true, 'Please add a Departure Station'],
        trim: true
    },
    // Added new field 'destination'
    destination: {
        type: String,
        required: [true, 'Please add a Destination Station'],
        trim: true
    }
}, {
    timestamps: true 
});

module.exports = mongoose.model('Train', trainSchema);