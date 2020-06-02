import asyncHandler from "../middleware/async";
import { NextFunction, Request, RequestHandler, Response } from "express";

import { Params } from "../type-models/express.models";
import Club from '../models/club'


export const getClubs = asyncHandler(async (req: Request<Params>, res: Response, next: NextFunction) => {
        const clubs = await Club.find()

        res.status(200).json({
                status: 'success',
                count: clubs.length,
                clubs
        })
})
