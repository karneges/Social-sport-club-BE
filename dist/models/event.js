"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose = __importStar(require("mongoose"));
const eventSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    eventType: {
        type: String,
        enum: ['train', 'competition', 'entertainment', 'challenge'],
        default: 'train'
    },
    startDateTime: {
        type: Date,
        default: Date.now,
        required: true
    },
    endDateTime: {
        type: Date,
        default: Date.now,
    },
    description: String,
    location: {
        lat: String,
        lng: String
    },
    accessLevel: {
        type: String,
        enum: ['all', 'privilege'],
        default: 'all'
    },
    excludeUsers: [{
            user: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User',
            }
        }]
});
exports.default = mongoose.model('Event', eventSchema);
//# sourceMappingURL=event.js.map