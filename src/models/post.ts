import { Schema, Document } from 'mongoose'
import * as mongoose from 'mongoose'
import { UserModel } from "./user";


const postSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    publicationDate: {
        type: Date,
        default: Date.now
    },
    likes: Number
})

export default mongoose.model<PostModel>('Post', postSchema)

export interface PostModel extends Document{
    author: UserModel
    publicationDate: Date
    likes: number
}
