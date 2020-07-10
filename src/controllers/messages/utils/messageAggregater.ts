import Message, { EntityFromMessageMap, MessageModel, MessagesMap } from '../../../models/message';
import { convertArrayToObject } from '../../../socket/utils/convert-array-to-objects';
import { BaseParamsInterface } from '../../../type-models/express.models';
import { Types } from 'mongoose'

export const messagesAggregate = async (mainUserId: Types.ObjectId, trgetUserId?: Types.ObjectId,): Promise<MessagesMap> => {
    const matchConfig: BaseParamsInterface = {}

    matchConfig.users = { "$all": [trgetUserId, mainUserId] }

    //if !userId then find go from all users
    if (!trgetUserId) {
        matchConfig.users = { "$all": [mainUserId] }
    }
    let messagesArray = await Message
        .aggregate<{ _id: string, countNoReadMessages: number, messages: MessageModel[] }>([
                // find all messages from main user
                {
                    $match: matchConfig
                },
                {
                    $project: {
                        message: 1,
                        users: 1,
                        read: 1,
                        sender: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        //find companion _id
                        companionId: {
                            $arrayElemAt: [
                                {
                                    $filter: {
                                        input: '$users',
                                        as: 'users',
                                        cond: { $ne: ['$$users', mainUserId] }
                                    },
                                },
                                0
                            ],
                        },
                    }
                },
                {
                    $group: {
                        _id: '$companionId',
                        countNoReadMessages: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $eq: ["$read", false] },
                                            { $ne: ['$sender', mainUserId] }
                                        ]
                                    }, 1, 0
                                ]
                            }
                        },
                        // add all fields, because $group no add our automatic
                        messages: { $push: "$$ROOT" }
                    }
                },
                // delete technical fields
                {
                    $project: {
                        'messages.companionId': 0,
                        'messages.users': 0
                    }
                },
                // slice message array
                {
                    $project: {
                        'messages': {
                            '$slice': ['$messages', -10]
                        },
                        countNoReadMessages: 1,
                    }
                }
            ]
        )
    // Populate Sender
    const messageArrayWithPopulationSender = await Message.populate<EntityFromMessageMap[]>(messagesArray, {
        path: 'messages.sender',
        model: 'User',
        select: 'name photoUrl'
    })
    return convertArrayToObject(messageArrayWithPopulationSender, '_id')
}
