import asyncHandler from '../middleware/async';
import { NextFunction, Request, Response } from 'express';
import { AddUserToRequest, Params, Query } from '../type-models/express.models';
import User from '../models/user'

export const getAllUsers = asyncHandler(async (req: Request<Params, any, any, Query> & AddUserToRequest, res: Response, next: NextFunction) => {
    const { _id: mainUserId } = req.user
    const users = await User.find({ _id: { $ne: mainUserId } }).select('name email photoUrl isOnline')
    res.status(200).json({
        success: true,
        users
    })
})

export const getUser = asyncHandler(async (req: Request<Params, any, any, Query>, res: Response, next: NextFunction) => {
    const users = await User.findById(req.params.id).select('name email photoUrl isOnline')
    res.status(200).json({
        success: true,
        users
    })
})
