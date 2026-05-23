const TrainDetection = require('../models/TrainDetectionModel');

// Get all detection records
exports.getAllDetections = async (req, res) => {
    try {
        const detections = await TrainDetection.find();
        res.status(200).json({
            success: true,
            count: detections.length,
            data: detections
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get detection records by train number
exports.getDetectionsByTrainNumber = async (req, res) => {
    try {
        const { trainNumber } = req.params;
        const detections = await TrainDetection.find({ trainNumber });
        res.status(200).json({
            success: true,
            count: detections.length,
            data: detections
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get detection records by date range
exports.getDetectionsByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const detections = await TrainDetection.find({
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        });
        res.status(200).json({
            success: true,
            count: detections.length,
            data: detections
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Create new detection record
exports.createDetection = async (req, res) => {
    try {
        const detection = await TrainDetection.create(req.body);
        res.status(201).json({
            success: true,
            data: detection
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Create multiple detection records
exports.createMultipleDetections = async (req, res) => {
    try {
        const detections = await TrainDetection.insertMany(req.body);
        res.status(201).json({
            success: true,
            count: detections.length,
            data: detections
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Update detection record
exports.updateDetection = async (req, res) => {
    try {
        const detection = await TrainDetection.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        res.status(200).json({
            success: true,
            data: detection
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Delete detection record
exports.deleteDetection = async (req, res) => {
    try {
        await TrainDetection.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Detection record deleted'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get statistics
exports.getStatistics = async (req, res) => {
    try {
        const stats = await TrainDetection.aggregate([
            {
                $group: {
                    _id: '$trainNumber',
                    trainName: { $first: '$trainName' },
                    totalRecords: { $sum: 1 },
                    avgDeviationKollupitiya: { $avg: '$minutesDeviationKollupitiya' },
                    avgDeviationNextStation: { $avg: '$minutesDeviationNextStation' }
                }
            },
            { $sort: { totalRecords: -1 } }
        ]);
        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
