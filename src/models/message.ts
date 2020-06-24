import { Schema, Document } from 'mongoose'
import mongoose from "mongoose";
import { UserModel } from './user';


const MessageSchema = new Schema({
        message: {
            text: { type: String, required: true },
            time: { type: Date, default: new Date() }
        },
        users: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
        sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        read: { type: Date }
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
    users: Schema.Types.ObjectId[],
    sender: Schema.Types.ObjectId,
    read: Date,
}
