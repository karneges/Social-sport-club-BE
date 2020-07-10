import { Schema, Document } from 'mongoose'
import mongoose from "mongoose";
import User, { IUser, UserModel } from './user';


const MessageSchema = new Schema({
        message: {
            text: { type: String, required: true },
            time: { type: Date, default: new Date() }
        },
        users: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
        sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        read: { type: Boolean, default: false }
    },
    {
        timestamps: true
    })

export default mongoose.model<MessageModel>('Message', MessageSchema)

export interface MessageModel extends Document {
    message: {
        text: string,
        time: string
    },
    users: Schema.Types.ObjectId[] | UserModel[],
    sender: string | Partial<UserModel>,
    read: boolean,
    receiver: Schema.Types.ObjectId,
}

export interface IMessage {
    message: {
        text: string
    },
    users: string[],
    sender: string,
    read?: string,
    receiver?: string,
}

export interface NewMessageClientCreated {
    message: {
        text: string,
    },
    sender: string,
    users: string[]
}

export class MessagesMap {
    [key: string]: EntityFromMessageMap
}

export interface EntityFromMessageMap {
    _id: string
    messages: MessageModel[]
    countNoReadMessages: number
}

export interface AggregatedMessages {
    _id: string,
    count: number,
    messages: MessageModel[]
}



