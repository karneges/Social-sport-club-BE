import asyncHandler from '../../../middleware/async';
import { NextFunction, Request, Response } from 'express';
import { AddUserToRequest, StravaQuery } from '../../../type-models/express.models';
import { StravaParams } from '../models/http.models';
import Strava, { StravaBaseModel } from '../models/stravaModel'
import axios from 'axios'
import strava from 'strava-v3'
import StravaTrain, { StravaTrainBaseModelModel } from '../models/strava-train-model'
import { StravaUrlGenerator } from '../models/stravaUrlGenerator';
import ErrorHandler from '../../../utils/errorHandler';
import { StravaTokenFactory } from '../models/strava-token-factory';
import { Types } from 'mongoose'

//@desc         Login user
//@route        POST /api/v1/strava
//@access       Public
export const registerNewStravaUser = asyncHandler(async (req: Request<StravaParams, any, any, StravaQuery> & AddUserToRequest, res: Response, next: NextFunction) => {

    const user = req.user
    const userCode = req.query.code

    const url = new StravaUrlGenerator(userCode).getStravaRegisterConfigUrl()
    const userWithStrava = await axios.post<StravaBaseModel>(url)
        .then(res => Strava.create(res.data))
        .then(({ _id }) => user.strava = _id)
        .then(() => user.save())
        .then(user => user.populate('strava').execPopulate())
        .catch(e => {
            console.log(e)
            throw new Error(e)
        })

    res.status(200).json({
        success: true,
        user: userWithStrava
    });
})

//@desc         Login user
//@route        GET /api/v1/strava/athlete
//@access       Public
export const getAthlete = asyncHandler(async (req: Request<StravaParams, any, any, StravaQuery> & AddUserToRequest, res: Response, next: NextFunction) => {
    const user = req.user
    const stravaEntity = await Strava.findById(user.strava)
    if (!stravaEntity) {
        return next(
            new ErrorHandler(`No find strava profile from user${ user._id }`,
                400)
        )
    }
    let stravaAccessToken = await new StravaTokenFactory(stravaEntity).getToken()
    const athlete = await strava.athlete.get({ 'access_token': stravaAccessToken })

    res.status(200).json({
        success: true,
        athlete
    });
})

//@desc         Login user
//@route        GET /api/v1/strava/activities
//@access       Public
export const getActivities = asyncHandler(async (req: Request<StravaParams, any, any, StravaQuery> & AddUserToRequest, res: Response, next: NextFunction) => {
    const user = req.user
    const stravaEntity = await Strava.findById(user.strava)
    if (!stravaEntity) {
        return next(
            new ErrorHandler(`No find strava profile from user${ user._id }`,
                400)
        )
    }
    let stravaAccessToken = await new StravaTokenFactory(stravaEntity).getToken()
    const activities: StravaTrainBaseModelModel[] = await strava.athlete.listActivities({ 'access_token': stravaAccessToken })
    const stravaTrainingsIds: Types.ObjectId[] = await StravaTrain.create(activities).then(trainings => trainings.map(train => train._id))

    await stravaEntity.updateOne(
        {
            $addToSet: {
                training: { $each: stravaTrainingsIds }
            }
        }, {
            runValidators: true
        })

    res.status(200).json({
        success: true,
        activities
    });
})



