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
const mongoose = __importStar(require("mongoose"));
const bcrypt = __importStar(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const config_1 = require("../config/config");
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    gId: {
        type: String,
        select: false
    },
    photoUrl: {
        type: String,
    },
    socketId: {
        type: String
    },
    age: Number,
    sex: {
        type: String,
        enum: ['male', 'female']
    },
    dateAddToClub: {
        type: Date,
        default: Date.now,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'trainer', 'user'],
        default: 'user'
    },
    isOnline: {
        type: Boolean
    },
    countDaysInClub: Number,
    rating: String,
    // TODO create Training Model
    training: String,
    invites: [
        {
            from: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User',
            },
            event: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Event',
            }
        }
    ],
    challenges: [
        {
            from: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User',
            },
            event: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Event',
            },
            status: String
        }
    ],
    // TODO create methods
    statistics: String,
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
// Switch user online status
UserSchema.pre('save', async function (next) {
    this.isOnline = !!this.socketId;
    next();
});
UserSchema.methods.getSignetJwtToken = function () {
    return jwt.sign({ id: this._id }, config_1.config.JWT_SECRET, {
        expiresIn: config_1.config.JWT_EXPIRE
    });
};
UserSchema.methods.getRefreshSignetJwtToken = function () {
    return jwt.sign({ id: this._id }, config_1.config.JWT_REFRESH_SECRET, {
        expiresIn: config_1.config.JWT_REFRESH_EXPIRE
    });
};
UserSchema.methods.matchPassword = async function (enteredPassword, gId = false) {
    if (gId) {
        return enteredPassword === this.gId;
    }
    return await bcrypt.compare(enteredPassword, this.password);
};
exports.default = mongoose.model('User', UserSchema);
//# sourceMappingURL=user.js.map