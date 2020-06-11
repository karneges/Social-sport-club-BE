import { Schema, Document } from 'mongoose'
import * as mongoose from 'mongoose'
import User, { UserModel } from './user'
import { PostModel } from "./post";
import { EventModel } from "./event";


const clubSchema = new Schema({
    name: { type: String, required: true },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    registerDate: {
        type: Date,
        default: Date.now
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    clubEvents: [{
        type: Schema.Types.ObjectId,
        ref: 'Event',
    }],
    clubRating: {
        type: Number,
        default: 100
    },
    posts: {
        type: [{ type: Schema.Types.ObjectId ,  ref: 'Post',}],
        select: false
    }
})

export default mongoose.model<ClubModel>('Club', clubSchema)

export interface ClubModel extends Document {
    name: string
    owner: UserModel
    registerDate: Date
    users: UserModel[]
    clubEvents: EventModel[]
    clubRating: number
    posts: PostModel[]
}
