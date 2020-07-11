import asyncHandler from '../../../middleware/async';
import { NextFunction, Request, Response } from 'express';
import { AddUserToRequest, Params, StravaQuery } from '../../../type-models/express.models';
import { StravaActivitiesBody, StravaAuthParams } from '../models/http.models';
import Strava from '../models/stravaModel'
import strava from 'strava-v3'
import StravaTrain from '../models/strava-train-model'
import ErrorHandler from '../../../utils/errorHandler';
import { StravaTokenFactory } from '../models/utils-classes/strava-token-factory';
import { StravaService } from '../services/strava.service';
import { StravaStatisticConfig, StravaStatisticsGenerator } from '../models/utils-classes/StravaStatisticsGenerator';

//@desc         Login user
//@route        POST /api/v1/strava
//@access       Public
export const registerNewStravaUser = asyncHandler(async (req: Request<StravaAuthParams, any, any, StravaQuery> & AddUserToRequest, res: Response, next: NextFunction) => {

    const user = req.user
    const userCode = req.query.code
    const userWithStrava = await StravaService.registerNewApiUser(user, userCode)

    res.status(200).json({
        success: true,
        user: userWithStrava
    });
    await StravaService.getAllUserActivities(req.user.strava, user._id)
})

//@desc         Login user
//@route        PUT /api/v1/strava/activities
//@access       Public
export const getAllActivities = asyncHandler(async (req: Request<StravaAuthParams, any, any, StravaQuery> & AddUserToRequest, res: Response, next: NextFunction) => {
    const user = req.user
    const activities = await StravaTrain.find({ user: user._id })
    res.status(200).json({
        success: true,
        activities
    });
})

//@desc         Get Summary Activities from Date And Fields
//@route        PUT /api/v1/strava/activities
//@access       Private
export const getSummaryActivitiesFromDateAndFields = asyncHandler(async (req: Request<Params, any, StravaActivitiesBody, StravaQuery> & AddUserToRequest, res: Response, next: NextFunction) => {
    const user = req.user
    const { topBarerDate, bottomBarerDate, fields } = req.body
    const config: StravaStatisticConfig = {
        date: {
            bottomBarerDate: new Date(new Date().getFullYear() - 6, 0, 1),
            topBarerDate: new Date(new Date().getFullYear(), 12, 31)
        },
        fields: ['distance', 'moving_time'],
    }
    const activities = await new StravaStatisticsGenerator(user._id, config).getStatistics()
    res.status(200).json({
        success: true,
        activities,
    });
})














//@desc         Login user
//@route        GET /api/v1/strava/athlete
//@access       Public
export const getAthlete = asyncHandler(async (req: Request<StravaAuthParams, any, any, StravaQuery> & AddUserToRequest, res: Response, next: NextFunction) => {
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



