import { Socket } from 'socket.io';
import Message, { IMessage, MessageModel, NewMessageClientCreated } from '../../models/message'
import { getReceiversSocketId } from '../utils/user.utils';


export const newMessage = (socket: Socket) => async (newMessage: NewMessageClientCreated) => {
    try {
        console.log(newMessage)
        let message: IMessage
        if (newMessage.users.length === 1) {
            message = { ...newMessage, receiver: newMessage.users[0] }
        }
        message = { ...newMessage, users: [...newMessage.users, newMessage.sender] }
        const receiversSocketIds = await getReceiversSocketId(newMessage)
        receiversSocketIds?.forEach(id => {
            socket.to(id).emit('newMessage', message)
        })
        await Message.create(message)
    } catch (e) {
        console.log(e)
    }
}
export const messageWasReade = (socket: Socket) => async (messageId: string) => {
    console.log('message reade')
    const message = await Message.findByIdAndUpdate(messageId, { read: true }, { runValidators: true, new: true })
}
