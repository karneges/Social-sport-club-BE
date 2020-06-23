import { Socket } from 'socket.io';
import { userAuthentication } from './socket-controllers/socket.auth.controller';
import { userDisconnect } from './socket-controllers/socket.disconnect.controller';

export const socketConnect = (socket: Socket) => {
    console.log(`new user connect! ${ socket.id }`)

    socket.on('auth', userAuthentication(socket))
    socket.on('disconnect', userDisconnect(socket))
}








