import { MessageModel } from '../../models/message';
import { UserModel } from '../../models/user';

export const convertMessageToMap = (messages: MessageModel[], mainUserId: string) => {
    let messageMap: { [key: string]: MessageModel[] } = {}

    messages.forEach((message) => {
        const key = (message.users as UserModel[])
            .find((user) => user._id.toString() !== mainUserId.toString())?._id
        if (messageMap[key]) {
            messageMap[key].push(message)
        } else {
            messageMap[key] = [message]
        }
    })
    return messageMap
}
