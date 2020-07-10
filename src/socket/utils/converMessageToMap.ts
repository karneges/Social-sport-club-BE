import { MessageModel, MessagesMap } from '../../models/message';
import { UserModel } from '../../models/user';

export const convertMessageToMap = (messages: MessageModel[], mainUserId: string): MessagesMap => {
    let messageMap: MessagesMap = {}

    messages.forEach((message) => {
        const key = (message.users as UserModel[])
            .find((user) => user._id.toString() !== mainUserId.toString())?._id
        if (messageMap[key]) {
            messageMap[key].messages.push(message)

        } else {
            messageMap[key].messages = [message]
        }
    })
    return messageMap
}
