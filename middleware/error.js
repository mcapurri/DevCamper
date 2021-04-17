const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log to the console for dev
    console.log(err);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource with ID: ${err.value} not found`;
        error = new ErrorResponse(message, 404);
    }

    //Mongoose duplicate key
    if (err.code === 11000) {
        console.log('err', err);
        const message = `Duplicate value entered. '${err.keyValue.name}' already exists.`;
        error = new ErrorResponse(message, 400);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((val) => val.message);
        error = new ErrorResponse(message, 400);
    }
    res.status(error.statusCode || 500).json({
        success: false,
        err: error.message || 'Server error',
    });
};

module.exports = errorHandler;
