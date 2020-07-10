import * as mongoose from "mongoose";
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { config } from "../config/config";
import { Schema, Document } from "mongoose";
import { EventModel } from "./event";

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
    strava: {
        type: Schema.Types.ObjectId,
        ref: 'Strava'
    },
    invites: [
        {
            from: {
                type: Schema.Types.ObjectId,
                ref: 'User',

            },
            event: {
                type: Schema.Types.ObjectId,
                ref: 'Event',
            }
        }
    ],
    challenges: [
        {
            from: {
                type: Schema.Types.ObjectId,
                ref: 'User',

            },
            event: {
                type: Schema.Types.ObjectId,
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

UserSchema.pre<UserModel>('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Switch user online status
UserSchema.pre<UserModel>('save', async function (next) {
    this.isOnline = !!this.socketId
    next();
});

UserSchema.methods.getSignetJwtToken = function () {
    return jwt.sign({ id: this._id }, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRE
    });
};

UserSchema.methods.getRefreshSignetJwtToken = function () {
    return jwt.sign({ id: this._id }, config.JWT_REFRESH_SECRET, {
        expiresIn: config.JWT_REFRESH_EXPIRE
    });
};

UserSchema.methods.matchPassword = async function (enteredPassword: string, gId: boolean = false) {
    if (gId) {
        return enteredPassword === this.gId
    }
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<UserModel>('User', UserSchema)

export interface UserModel extends Document, IUser {

    getSignetJwtToken: () => string
    getRefreshSignetJwtToken: () => string
    matchPassword: (password: string, gId?: boolean) => Promise<boolean>
}

export interface IUser {
    name: string
    email: string
    age: number
    sex: 'male' | 'female'
    dateAddToClub: Date
    role: 'admin' | 'trainer' | 'user'
    countDaysInClub: number
    rating: string
    training: string
    invites: EventModel[]
    challenges: EventModel[]
    statistics: string,
    password: string,
    gId?: string
    socketId?: string
    photoUrl?: string
    resetPasswordToken: string
    resetPasswordExpire: Date
    createdAt: Date
    isOnline: boolean,
    strava: mongoose.Types.ObjectId
}

