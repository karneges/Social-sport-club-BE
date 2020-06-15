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
    updateDate: {
        type: Date
    },
    likes: {
        type: Number,
        default: 0
    },
    content: {
        type: String,
        minlength: 5,
        required: true
    }
})

postSchema.pre('save', async function (next) {
    if (this.isModified('content')) {
        (this as PostModel).updateDate = new Date()
    }
    next()
})

export default mongoose.model<PostModel>('Post', postSchema)

export interface PostModel extends Document {
    author: UserModel
    publicationDate: Date,
    updateDate: Date
    likes: number
    content: string
}
