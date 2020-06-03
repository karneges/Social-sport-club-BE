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
const clubSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    registerDate: {
        type: Date,
        default: Date.now
    },
    users: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        }],
    clubEvents: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Event',
        }],
    clubRating: {
        type: Number,
        default: 100
    },
    posts: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Post',
            select: false
        }]
});
exports.default = mongoose.model('Club', clubSchema);
//# sourceMappingURL=club.js.map