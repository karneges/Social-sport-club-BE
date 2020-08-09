import asyncHandler from '../middleware/async';
import { NextFunction, Request, Response } from 'express';
import { Params, Query } from '../type-models/express.models';
import Post, { PostModel } from '../models/post';
import Club from '../models/club';
import ErrorHandler from '../utils/errorHandler';
import { paginator } from '../utils/paginator';


//@desc         Add post to club
//@route        POST /api/v1/clubs/:id/posts
//@access       Private
export const addPostToCLub = asyncHandler(async (req: Request<Params, any, PostModel>, res: Response, next: NextFunction) => {
    const clubId = req.params.id

    // Post create and populate author
    let post = await Post.create(req.body)
    post = await post.populate({
        path: 'author',
        select: 'name photoUrl'
    }).execPopulate()

    // Select +post because thi is not selectable field
    const club = await Club.findById(clubId).select('+posts')

    if (!club) {
        return next(
            new ErrorHandler(`No club with ID${ post.id }`,
                400)
        )
    }

    club.posts.push(post.id)
    await club.save()
    res.status(201).json({
        status: 'success',
        post
    })
})


//@desc         Get club posts
//@route        GET /api/v1/clubs/:id/posts
//@access       Public
export const getPosts = asyncHandler(async (req: Request<Params, any, any, Query>, res: Response, next: NextFunction) => {
    const { limit, skip } = paginator(+req.query.page, +req.query.limit)
    const { posts } = (await Club.findById(req.params.id).populate({
        path: 'posts',
        options: { sort: '-publicationDate' },
        limit,
        skip,
        populate: {
            path: 'author'
        }
    }))!
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

export const editPost = asyncHandler(async (req: Request<Params, any, PostModel>, res: Response, next: NextFunction) => {
    let post = await Post.findById(req.params.postId).populate({
        path: 'author',
        select: 'name photoUrl',
    }).exec()
    if (!post) {
        return next(
            new ErrorHandler(`No club with ID${ req.params.postId }`,
                400)
        )
    }
    if (req.query.likes) {
        delete req.body.likes
        post.likes += 1
    }
    for (let field in req.body) {
        // @ts-ignore
        post[field] = req.body[field]
    }
    await post.save()
    res.status(200).json({
        status: 'success',
        post
    })

})

export const deletePost = asyncHandler(async (req: Request<Params, any, PostModel>, res: Response, next: NextFunction) => {
    const post = await Post.findByIdAndDelete()
    res.status(202).json({
        status: 'success'
    })
})
