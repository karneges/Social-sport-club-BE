import { Socket } from 'socket.io';
import Message, { MessageModel, NewMessageClientCreated } from '../../models/message'
import { getReceiversSocketId } from '../utils/user.utils';


export const newMessage = (socket: Socket) => async (newMessage: NewMessageClientCreated) => {
    try {
        const receiversSocketIds = await getReceiversSocketId(newMessage)
        const createdMessage = await Message.create(newMessage)
        const message = await createdMessage.populate({
            path: 'sender',
            select: 'name photoUrl'
        }).execPopulate()

        let messageMap: { [key: string]: { messages: MessageModel[] } }
        if (typeof message.sender !== "string") {
            messageMap = { [message.sender._id]: { messages: [message] } }
        }
        receiversSocketIds?.forEach(id => {
            socket.to(id).emit('newMessage', messageMap)
        })
    } catch (e) {
        console.log(e)
    }
}
export const messageWasReade = (socket: Socket) => async (messageId: string) => {
    console.log('message reade')
    const message = await Message.findByIdAndUpdate(messageId, { read: true }, { runValidators: true, new: true })
}
