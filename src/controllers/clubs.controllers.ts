import asyncHandler from "../middleware/async";
import { NextFunction, Request,Response } from "express";

import { AdvancedResult, Params } from "../type-models/express.models";
import Club from '../models/club'
import Post, { PostModel } from '../models/post'
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

//@desc         Add new post to club
//@route        POST /api/v1/clubs/:id/post
//@access       Private
export const addPostToCLub = asyncHandler(async (req: Request<Params, any, PostModel>, res: Response, next: NextFunction) => {
    const clubId = req.params.id
    const { id } = await Post.create(req.body)
    const club = await Club.findById(clubId)

    if (!club) {
        return next(
            new ErrorHandler(`No club with ID${ id }`,
                400)
        )
    }

    club.posts.push(id)
    await club.save()
    res.status(201).json({
        status: 'success',
        club
    })
})


//@desc         Get club posts
//@route        GET /api/v1/clubs/:id/posts
//@access       Public
export const getPosts = asyncHandler(async (req: Request<Params>, res: Response, next: NextFunction) => {
    const { posts } = (await Club.findById(req.params.id).populate('posts').select('posts'))!

    if (!posts) {
        return next(
            new ErrorHandler(`No club with ID${ req.params.id }`,
                400)
        )
    }

    res.status(200).json({
        status: 'success',
        posts
    })
})
