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
    age: Number,
    sex: {
        type: String,
        enum: ['male', 'female'],
        required: [true, 'please add gender']
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
    countDaysInClub: Number,
    rating: String,
    // TODO create Training Model
    training: String,
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

UserSchema.methods.getSignetJwtToken = function () {
    return jwt.sign({ id: this._id }, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRE
    });
};

UserSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<UserModel>('User', UserSchema)

export interface UserModel extends Document {
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
    password: string
    resetPasswordToken: string
    resetPasswordExpire: Date
    createdAt: Date
}

