import asyncHandler from '../middleware/async';
import { NextFunction, Request, Response } from 'express';
import { AddUserToRequest, Params } from '../type-models/express.models';
import Message, { MessageModel } from '../models/message';


//@desc         Add event to club
//@route        POST /api/v1/messages/:userId
//@access       Private
export const getMessages = asyncHandler(async (req: Request<Params, any, MessageModel> & AddUserToRequest, res: Response, next: NextFunction) => {
    const { userId } = req.params
    const { _id: mainUserId } = req.user
    const messages = await Message.find({users: { "$all": [userId, mainUserId] }})
        .limit(20)
        .sort({ createdAt: -1 })

    res.status(201).json({
        status: 'success',
        count: messages.length,
        messages: messages.reverse()
    })
})



