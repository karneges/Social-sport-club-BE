import asyncHandler from '../middleware/async';
import { NextFunction, Request, Response } from 'express';
import { Params, Query } from '../type-models/express.models';
import User from '../models/user'

export const getAllUsers = asyncHandler(async (req: Request<Params, any, any, Query>, res: Response, next: NextFunction) => {
    const users = await User.find().select('name email photoUrl isOnline')
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
