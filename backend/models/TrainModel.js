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
        type: String, // You can also use Date if you need strict parsing
        required: [true, 'Please add a Departure Time']
    },
    departureStation: {
        type: String,
        required: [true, 'Please add a Departure Station'],
        trim: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields automatically
});

module.exports = mongoose.model('Train', trainSchema);