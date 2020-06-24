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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReceiversSocketId = exports.getUserByToken = exports.getUserBySocketId = void 0;
const user_1 = __importDefault(require("../../models/user"));
const jwt = __importStar(require("jsonwebtoken"));
const config_1 = require("../../config/config");
exports.getUserBySocketId = async (socketId) => {
    try {
        return user_1.default.findOne({ socketId });
    }
    catch (e) {
        console.log(e);
    }
};
exports.getUserByToken = async (token) => {
    let decoded;
    decoded = jwt.verify(token, config_1.config.JWT_SECRET);
    return user_1.default.findById(decoded.id).select('name email photoUrl isOnline');
};
exports.getReceiversSocketId = async (message) => {
    const { sender, users } = message;
    const receiversIds = users.filter(user => user !== sender);
    try {
        const socketIdsWithMongoId = await user_1.default.find({ _id: { '$in': [...receiversIds] } }).select('socketId');
        return socketIdsWithMongoId.map(user => user.socketId);
    }
    catch (e) {
        console.log(e);
    }
};
//# sourceMappingURL=user.utils.js.map