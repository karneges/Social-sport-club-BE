import { Socket } from 'socket.io';
import Message from '../../models/message'
import { MessageModel } from '../../models/message';
import { getReceiversSocketId } from '../utils/user.utils';


export const newMessage = (socket: Socket) => async (newMessage: MessageModel) => {
    try {
        const receiversSocketIds = await getReceiversSocketId(newMessage)
        receiversSocketIds?.forEach(id => {
            socket.to(id).emit('newMessage', message)
        })
        const message = await Message.create(newMessage)
    } catch (e) {
        console.log(e)
    }
}
