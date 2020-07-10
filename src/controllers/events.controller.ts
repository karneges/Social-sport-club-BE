
import asyncHandler from '../middleware/async';
import { NextFunction, Request, Response } from 'express';
import { Params, Query } from '../type-models/express.models';
import Event, { EventModel } from '../models/event';
import Club from '../models/club';
import ErrorHandler from '../utils/errorHandler';
import { paginator } from '../utils/paginator';


//@desc         Add event to club
//@route        POST /api/v1/clubs/:id/events
//@access       Private
export const addEventToCLub = asyncHandler(async (req: Request<Params, any, EventModel>, res: Response, next: NextFunction) => {
    const clubId = req.params.id
    const event = await Event.create(req.body)
    const club = await Club.findById(clubId).select('+clubEvents')

    if (!club) {
        return next(
            new ErrorHandler(`No club with ID${ clubId }`,
                400)
        )
    }

    club.posts.push(event.id)
    await club.save()
    res.status(201).json({
        status: 'success',
        event
    })
})


//@desc         Get club events
//@route        GET /api/v1/clubs/:id/events
//@access       Public
export const getEvents = asyncHandler(async (req: Request<Params, any, any, Query>, res: Response, next: NextFunction) => {
    //TODO limit from date
    const { limit, skip } = paginator( +req.query.page,+req.query.limit)
    const { clubEvents: events } = (await Club.findById(req.params.id).populate({
        path: 'clubEvents',
        options: { sort: '-startDateTime'},
        limit,
        skip,
    }))!

    if (!events) {
        return next(
            new ErrorHandler(`No event with ID${ req.params.id }`,
                400)
        )
    }

    res.status(200).json({
        status: 'success',
        events
    })
})

export const editEvent = asyncHandler(async (req: Request<Params, any, EventModel>, res: Response, next: NextFunction) => {
    let event = await Event.findById(req.params.eventId)

    if (!event) {
        return next(
            new ErrorHandler(`No event with ID${ req.params.eventId }`,
                400)
        )
    }
    for (let field in req.body) {
        // @ts-ignore
        event[field] = req.body[field]
    }
    await event.save()
    res.status(200).json({
        status: 'success',
        event
    })

})

export const deleteEvent = asyncHandler(async (req: Request<Params, any, EventModel>, res: Response, next: NextFunction) => {
    const post = await Event.findByIdAndDelete()
    res.status(202).json({
        status: 'success'
    })
})
