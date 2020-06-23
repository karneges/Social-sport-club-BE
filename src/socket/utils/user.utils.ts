import User from '../../models/user';
import * as jwt from 'jsonwebtoken';
import { config } from '../../config/config';

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
