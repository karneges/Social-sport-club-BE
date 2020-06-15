import asyncHandler from "../middleware/async";
import { NextFunction, Request, Response } from "express";

import { AdvancedResult, Params } from "../type-models/express.models";
import Club from '../models/club'
import ErrorHandler from "../utils/errorHandler";

//@desc         Get all clubs
//@route        GET /api/v1/clubs/
//@access       Public
export const getClubs = asyncHandler(async (req: Request<Params> & AdvancedResult, res: Response) => {
    res.status(200).json(req.advancedResult)
})

//@desc         Get single clubs
//@route        GET /api/v1/clubs/:id
//@access       Public
export const getClub = asyncHandler(async (req: Request<Params>, res: Response, next: NextFunction) => {
    const { id } = req.params
    const club = await Club.findById(id)
    if (!club) {
        return next(
            new ErrorHandler(`No club with ID${ id }`,
                400)
        )
    }
    res.status(200).json({
        success: true,
        club
    })
})

// export const addUserToClub = asyncHandler(async (req: Request<Params>, res: Response, next: NextFunction) => {
//     const user = await User.findById()
// })
