import { Socket } from 'socket.io';
import { getUserBySocketId } from '../utils/user.utils';

export const userDisconnect = (socket: Socket) => async () => {
    const user = await getUserBySocketId(socket.id)
    console.log(`User ${user?.name} disconnect`.yellow)
    if (user) {
        user.socketId = ''
        await user.save()
        socket.broadcast.emit('userChangeOnlineStatus', user)
    }
}
