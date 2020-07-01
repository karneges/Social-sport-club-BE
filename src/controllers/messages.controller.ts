import asyncHandler from '../middleware/async';
import { NextFunction, Request, Response } from 'express';
import { AddUserToRequest,Params } from '../type-models/express.models';
import Message, { MessageModel } from '../models/message';
import { convertMessageToMap } from '../socket/utils/converMessageToMap';


//@desc         Add event to club
//@route        POST /api/v1/messages/:userId
//@access       Private
export const getMessages = asyncHandler(async (req: Request<Params, any, MessageModel> & AddUserToRequest, res: Response, next: NextFunction) => {
    const { userId } = req.params
    const { _id: mainUserId } = req.user
    let messages = await Message.find({ users: { "$all": [userId, mainUserId] } })
        .limit(20)
        .populate({
            path:'sender',
            select: 'name photoUrl'
        })
        .sort({ createdAt: -1 })

    messages = messages.reverse()
    let messageMap: { [key: string]: MessageModel[] } = convertMessageToMap(messages, mainUserId)
    console.log(messageMap)
    res.status(201).json({
        status: 'success',
        count: messages.length,
        messages: messageMap
    })
})

export const getNoReadMessagesFromUser = asyncHandler(async (req: Request<Params, any, MessageModel> & AddUserToRequest, res: Response, next: NextFunction) => {
    const { _id: mainUserId } = req.user
    console.log('req')
    let messages = await Message
        .find({
            users: { "$all": [mainUserId] },
            read: false
        }).populate({
            path: 'users',
            select: 'name photoUrl'
        }).sort({ createdAt: -1 })

    messages = messages.reverse()
    let messageMap: { [key: string]: MessageModel[] } = convertMessageToMap(messages, mainUserId)
    res.status(201).json({
        status: 'success',
        count: messages.length,
        messages: messageMap
    })
})



