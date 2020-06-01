import { Schema, Document } from 'mongoose'
import * as mongoose from 'mongoose'
import { UserModel } from './user'


const eventSchema = new Schema({
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
            type: Schema.Types.ObjectId,
            ref: 'User',
        }
    }]

})

export default mongoose.model<EventModel>('Event', eventSchema)

export interface EventModel extends Document{
    name: string
    eventType: 'train' | 'competition' | 'entertainment' | 'challenge'
    startDateTime: Date
    endDateTime: Date
    description: string
    location: {
        lat: string,
        lng: string
    },
    accessLevel: 'all' | 'privilege',
    excludeUsers: UserModel
}
