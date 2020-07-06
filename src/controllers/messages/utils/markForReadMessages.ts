import Message from '../../../models/message';

export const markForRead = async (mainUserId: string, companionId: string) => {
    //     find all no reade messages
    //    update them
    const messages = await Message.updateMany(
        {
            users: { $all: [mainUserId, companionId] },
            sender: { $ne: mainUserId }
        },
        { read: true }
        , { runValidators: true })
    console.log(messages)
}
