import asyncHandler from '../../../middleware/async';
import { NextFunction, Request, Response } from 'express';
import { AddUserToRequest, Params, StravaQuery } from '../../../type-models/express.models';
import { StravaActivitiesBodyRequest, StravaAuthParams } from '../models/http.models';
import Strava from '../models/stravaModel'
import strava from 'strava-v3'
import StravaTrain from '../models/strava-train-model'
import ErrorHandler from '../../../utils/errorHandler';
import { StravaTokenFactory } from '../models/utils-classes/strava-token-factory';
import { StravaService } from '../services/strava.service';
import {
    StravaStatisticsGenerator
} from '../models/utils-classes/strava-statistics-generator/strava-statistics-generator';
import { ActivitiesStatisticValues } from '../models/utils-classes/strava-statistics-generator/models/strava-statistics-models';

//@desc         Register New Strava User
//@route        POST /api/v1/strava
//@access       Public
export const registerNewStravaUser = asyncHandler(
    async (
        req: Request<StravaAuthParams, any, any, StravaQuery> & AddUserToRequest,
        res: Response,
        next: NextFunction
    ) => {

        const user = req.user
        const userCode = req.query.code
        const userWithStrava = await StravaService.registerNewApiUser(user, userCode)

        res.status(200).json({
            success: true,
            user: userWithStrava
        });
        await StravaService.getAllUserActivities(req.user.strava, user._id)
    })
//@desc         Remove Strava User
//@route        DELETE /api/v1/strava/
//@access       Public
export const removeStravaUser = asyncHandler(
    async (
        req: Request & AddUserToRequest,
        res: Response,
        next: NextFunction
    ) => {
        const user = req.user
        const userWithoutStrava = await StravaService.removeStravaUser(user)

        res.status(200).json({
            success: true,
            user: userWithoutStrava
        });
    })

//@desc         Login user
//@route        PUT /api/v1/strava/activities
//@access       Public
export const getAllActivities = asyncHandler(
    async (
        req: Request<StravaAuthParams, any, any, StravaQuery> & AddUserToRequest,
        res: Response,
        next: NextFunction
    ) => {
        const user = req.user
        const activities = await StravaTrain.find({ user: user._id })
        res.status(200).json({
            success: true,
            activities
        });
    })

//@desc         Get Summary Activities from Date And Fields
//@route        PUT /api/v1/strava/activities-by-sport-type
//@access       Private
export const getSummaryActivitiesFromDateAndFieldsBySportType = asyncHandler(
    async (
        req: Request<Params, any, StravaActivitiesBodyRequest, StravaQuery> & AddUserToRequest,
        res: Response,
        next: NextFunction
    ) => {
        const user = req.user
        const activities = await new StravaStatisticsGenerator(user._id, req.body).getStatisticsBySportTypes()
        res.status(200).json({
            success: true,
            activities,
        });
    })
//@desc         Get Summary Activities from Date And Fields
//@route        PUT /api/v1/strava/activities-by-train-values
//@access       Private
export const getSummaryActivitiesFromDateAndFieldsFromFileds = asyncHandler(
    async (
        req: Request<Params, any, StravaActivitiesBodyRequest, StravaQuery> & AddUserToRequest,
        res: Response,
        next: NextFunction
    ) => {
        const user = req.user
        // Get first element in Array
        let [activities] = await new StravaStatisticsGenerator(user._id, req.body).getStatisticsByTrainValues()
        // Convert query result to must result
        activities = Object.entries<{ [key: string]: ActivitiesStatisticValues }>(activities).map(([key, value]) => {
                Object.keys({ ...value }).forEach((key) => value[key] = { ...value[key], sportType: key })
                return { _id: key, sportTypes: Object.values(value) }
            }
        )

        res.status(200).json({
            success: true,
            activities: activities,
        });
    })
//@desc         Get Summary Activities from Date And Fields
//@route        PUT /api/v1/strava/activities-by-train-values
//@access       Private
export const getActivitiesTrainValuesByDayRange = asyncHandler(
    async (
        req: Request<Params, any, StravaActivitiesBodyRequest, StravaQuery> & AddUserToRequest,
        res: Response,
        next: NextFunction
    ) => {
        const user = req.user
        console.log(req.body)
        const activities = await new StravaStatisticsGenerator(user._id, req.body).getActivitiesTrainValuesByDayRange()
        res.status(200).json({
            success: true,
            activities: activities,
        });
    })


//@desc         Login user
//@route        GET /api/v1/strava/athlete
//@access       Public
export const getAthlete = asyncHandler(
    async (
        req: Request<StravaAuthParams, any, any, StravaQuery> & AddUserToRequest,
        res: Response,
        next: NextFunction
    ) => {
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

//@desc         Register New Strava User
//@route        POST /api/v1/strava/activities-all
//@access       Public
export const getAllUserActivities = asyncHandler(
    async (
        req: Request<StravaAuthParams, any, any, StravaQuery> & AddUserToRequest,
        res: Response,
        next: NextFunction
    ) => {

        const userWithStrava = await StravaService.getAllUserActivities(req.user.strava, req.user._id)
        res.status(200).json({
            success: true,
            user: userWithStrava
        });

    })



