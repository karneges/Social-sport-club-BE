"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    //Log to console for dev
    console.log(`${err}`.red);
    //Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Bootcamp not found with id of ${err.value}`;
        error = new errorHandler_1.default(message, 404);
    }
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new errorHandler_1.default(message, 400);
    }
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(((err) => err.message));
        error = new errorHandler_1.default(message, 400);
    }
    res.status(error.status || 500).json({
        success: false,
        error: error.message || 'Server error'
    });
};
exports.default = errorHandler;
//# sourceMappingURL=error.js.map