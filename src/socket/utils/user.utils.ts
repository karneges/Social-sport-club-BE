import User from '../../models/user';
import * as jwt from 'jsonwebtoken';
import { config } from '../../config/config';
import { MessageModel } from '../../models/message';

export const getUserBySocketId = async (socketId: string) => {
    try {
        return User.findOne({ socketId })
    } catch (e) {
        console.log(e)
    }
}


export const getUserByToken = async (token: string) => {
    let decoded: { id: string }
    decoded = jwt.verify(token, config.JWT_SECRET) as { id: string };
    return User.findById(decoded.id).select('name email photoUrl isOnline')
}

export const getReceiversSocketId = async (message: MessageModel): Promise<string[] | undefined> => {
    const { sender, users } = message
    const receiversIds = users.filter(user => user !== sender)
    try {
        const socketIdsWithMongoId = await User.find({ _id: { '$in': [...receiversIds] } }).select('socketId')
        return socketIdsWithMongoId.map(user => user.socketId) as string[]
    } catch (e) {
        console.log(e)
    }
}
