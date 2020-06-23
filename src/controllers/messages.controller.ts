import asyncHandler from '../middleware/async';
import { NextFunction, Request, Response } from 'express';
import { Params, Query } from '../type-models/express.models';
import Message, { MessageModel } from '../models/message';


//@desc         Add event to club
//@route        POST /api/v1/clubs/:id/events
//@access       Private
export const getMessages = asyncHandler(async (req: Request<Params, any, MessageModel>, res: Response, next: NextFunction) => {

    // @ts-ignore
    const messages = await Message.find({ users: { "$in": ['5ef23fcd820dc27d92ff1b61', '5eee6333fa068b651d8671da'] } })
        .sort({ updatedAt: -1 })
        .limit(20)
    console.log(messages)

    res.status(201).json({
        status: 'success',
        count: messages.length,
        messages
    })
})


