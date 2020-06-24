import { Socket } from 'socket.io';
import { userAuthentication } from './socket-controllers/socket.auth.controller';
import { userDisconnect } from './socket-controllers/socket.disconnect.controller';
import { newMessage } from './socket-controllers/socket.messages.controller';

export const socketConnect = (socket: Socket) => {
    console.log(`new user connect! ${ socket.id }`)

    socket.on('auth', userAuthentication(socket))
    socket.on('disconnect', userDisconnect(socket))
    socket.on('newMessage', newMessage(socket))
}








