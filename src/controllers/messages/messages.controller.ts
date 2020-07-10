import asyncHandler from '../../middleware/async';
import { NextFunction, Request, Response } from 'express';
import { AddUserToRequest, Params } from '../../type-models/express.models';
import { MessageModel } from '../../models/message';
import { messagesAggregate } from './utils/messageAggregater';
import { Types } from 'mongoose';
import { markMessagesAsRead } from './utils/markAsReadMessages';


//@desc         Add event to club
//@route        POST /api/v1/messages/:userId
//@access       Private
export const getMessages = asyncHandler(async (req: Request<Params, any, MessageModel> & AddUserToRequest, res: Response, next: NextFunction) => {
    const { userId } = req.params
    const { _id: mainUserId } = req.user

    const messageMap = await messagesAggregate(mainUserId, Types.ObjectId(userId))
    res.status(201).json({
        status: 'success',
        messages: messageMap
    })
})


//@desc         Add event to club
//@route        POST /api/v1/messages/noread
//@access       Private
export const getNoReadMessagesFromUser = asyncHandler(async (req: Request<Params, any, MessageModel> & AddUserToRequest, res: Response, next: NextFunction) => {
    const { _id: mainUserId } = req.user

    const messageMap = await messagesAggregate(mainUserId)
    res.status(201).json({
        status: 'success',
        messages: messageMap
    })
})
//@desc         Add event to club
//@route        POST /api/v1/messages/markasread/:userId
//@access       Private
export const markAsReadMessages = asyncHandler(async (req: Request<Params, any, MessageModel> & AddUserToRequest, res: Response, next: NextFunction) => {
    const { userId } = req.params
    const { _id: mainUserId } = req.user
    await markMessagesAsRead(mainUserId, userId!)

    res.status(201).json({
        status: 'success',
    })
})
