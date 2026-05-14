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
    line: {
        type: String,
        required: [true, 'Please add a Line'],
        trim: true
    },
    station: {
        type: String,
        required: [true, 'Please add a Station'],
        trim: true
    },
    stopStatus: {
        type: String,
        enum: ['Stop', 'Pass Only'],
        default: 'Stop'
    },
    timeAtStation: {
        type: String,
        trim: true
    },
    arrivalTime: {
        type: String,
        trim: true
    },
    departureTime: {
        type: String,
        required: [true, 'Please add a Departure Time']
    },
    direction: {
        type: String,
        enum: ['UP', 'DOWN'],
        default: 'UP'
    },
    runningDays: {
        type: [String],
        default: []
    },
    trainType: {
        type: String,
        enum: ['Slow', 'Express', 'Intercity', 'Night Mail'],
        default: 'Slow'
    },
    activeStatus: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    departure: {
        type: String,
        required: [true, 'Please add a Departure Station'],
        trim: true
    },
    destination: {
        type: String,
        required: [true, 'Please add a Destination Station'],
        trim: true
    }
}, {
    timestamps: true 
});

module.exports = mongoose.model('Train', trainSchema);