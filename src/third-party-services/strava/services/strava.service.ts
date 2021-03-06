import { StravaUrlGenerator } from '../models/utils-classes/stravaUrlGenerator';
import axios from 'axios';
import Strava, { StravaBaseModel, StravaModel } from '../models/stravaModel';
import { UserModel } from '../../../models/user';
import { StravaTokenFactory } from '../models/utils-classes/strava-token-factory';
import StravaTrain, {
    StravaTrainBaseModel,
    StravaTrainModel,
    StravaTrainResponseModel
} from '../models/strava-train-model';
import strava from 'strava-v3';
import * as mongoose from 'mongoose';

export class StravaService {


    public static async registerNewApiUser(user: UserModel, userCode: string): Promise<UserModel> {
        const url = new StravaUrlGenerator(userCode).getStravaRegisterConfigUrl()
        return await axios.post<StravaBaseModel>(url)
            .then(res => Strava.create(res.data))
            .then(({ _id }) => user.strava = _id)
            .then(() => user.save())
            .then(user => user.populate({
                path: 'strava',
                select: 'athlete'
            }).execPopulate())
            .catch(e => {
                console.log(e)
                throw new Error(e)
            })
    }

    public static async removeStravaUser(user: UserModel): Promise<UserModel> {
        return Strava.findByIdAndDelete(user.strava).then(() => user.save())
    }

    public static async getAllUserActivities(userStravaId: mongoose.Types.ObjectId, trainOwnerId: string): Promise<StravaTrainModel[]> {
        const stravaEntity = await Strava.findById(userStravaId) as StravaModel
        let stravaAccessToken = await new StravaTokenFactory(stravaEntity).getToken()
        // return await strava.athlete.listActivities({ 'access_token': stravaAccessToken, per_page: 400 })
        return this.getAllActivitiesByAthlete(stravaAccessToken)
            .then((trains: StravaTrainResponseModel[]): StravaTrainBaseModel[] => trains.map(training => {
                return {
                    ...training,
                    user: trainOwnerId
                }
            }))
            .then((trains) => StravaTrain.create(trains))
            .catch(e => {
                console.log(e)
                throw new Error(e)
            })

    }

    private static async getAllActivitiesByAthlete(stravaAccessToken: string): Promise<StravaTrainResponseModel[]> {
        let pageCounter = 1
        let trainsAccumulator: StravaTrainResponseModel[] = []
        const activitiesRecursion = async () => {
            const trains = await strava.athlete.listActivities({
                'access_token': stravaAccessToken,
                page: pageCounter
            }) as StravaTrainResponseModel[]
            trainsAccumulator.push(...trains)
            if (trains.length === 30) {
                pageCounter += 1
                await activitiesRecursion()
            }

        }
        await activitiesRecursion()
        return trainsAccumulator
    }
}
