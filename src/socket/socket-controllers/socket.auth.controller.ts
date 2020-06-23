import { Socket } from 'socket.io';
import User, { UserModel } from '../../models/user';
import { getUserByToken } from '../utils/user.utils';

export const userAuthentication = (socket: Socket) => async (token: string, callback: (isAuthPassed: boolean) => void) => {
    let user: UserModel | null
    try {
        user = await getUserByToken(token)
        if (user) {
            user.socketId = socket.id
            user = await user.save()
            callback(true)
            console.log(`User ${ user?.name } passed auth `.green)
            socket.broadcast.emit('userChangeOnlineStatus', user)
        }

    } catch (e) {
        console.error(`User  with id ${ socket.id } no failed auth `)
        callback(false)
    }
}
