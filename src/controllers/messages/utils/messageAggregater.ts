import Message, { EntityFromMessageMap, MessageModel, MessagesMap } from '../../../models/message';
import { convertArrayToObject } from '../../../socket/utils/convert-array-to-objects';
import { BaseParamsInterface } from '../../../type-models/express.models';

export const messagesAggregate = async (mainUserId: string, trgetUserId?: string,): Promise<MessagesMap> => {

    const matchConfig: BaseParamsInterface = {}
    matchConfig.users = { "$all": [mainUserId, trgetUserId] }

    //if !userId then find go from all users
    if (!trgetUserId) {
        matchConfig.users = { "$all": [mainUserId] }
        matchConfig.sender = { '$ne': mainUserId }
    }
    console.log(matchConfig)
    let messagesArray = await Message
        .aggregate<{ _id: string, countNoReadMessages: number, messages: MessageModel[] }>([
                // find all no read messages
                {
                    '$match': matchConfig
                },
                // group by senders and add count field
                {
                    '$group': {
                        _id: '$sender',
                        countNoReadMessages: { "$sum": { "$cond": [{ "$eq": ["$read", true] }, 0, 1] } },
                        messages: { $push: "$$ROOT" }
                    }
                },
            ]
        )
        .limit(20)
        .sort({ createdAt: -1 })
    console.log(messagesArray)
    // Populate Sender
    const messageArrayWithPopulationSender = await Message.populate<EntityFromMessageMap[]>(messagesArray, {
        path: 'messages.sender',
        model: 'User'
    }).then(messagesArray => messagesArray.reverse())
    return convertArrayToObject(messageArrayWithPopulationSender, '_id')
}
