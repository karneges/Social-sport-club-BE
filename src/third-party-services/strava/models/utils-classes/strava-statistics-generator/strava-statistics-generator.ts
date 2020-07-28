import StravaTrain from '../../strava-train-model';
import { StravaActivitiesBodyRequest } from '../../http.models';
import { StravaStatisticsGeneratorBaseClass } from './strava-statistics-generator-base-class';
import { SportTypes, TrainingValues } from './models/strava-statistics-models';
import * as mongoose from 'mongoose';

export class StravaStatisticsGenerator extends StravaStatisticsGeneratorBaseClass {

    constructor(userId: mongoose.Types.ObjectId, config: StravaActivitiesBodyRequest) {
        super(userId, config)
    }

    async getStatisticsBySportTypes(): Promise<{ [p: string]: any }> {
        return StravaTrain.aggregate([
            {
                $match: this.getMatchConfig()
            },
            {
                $group: {
                    _id: '$type',
                    doc: { $push: '$$CURRENT' }
                }
            },
            {
                $project: {
                    _id: 1,
                    ...this.getProjectConfigForSportTypesStatistics()
                }
            },
        ])
    }

    async getStatisticsByTrainValues(): Promise<{ [p: string]: any }[]> {
        return StravaTrain.aggregate([
            {
                $match: this.getMatchConfig()
            },
            {
                $group: {
                    _id: null,
                    doc: { $push: '$$ROOT' }
                }
            },
            {
                $project: this.getProjectConfigForTrainValuesStatistics()
            },
        ])

    }

    async getActivitiesTrainValuesByDayRange(): Promise<ActivitiesTrainValuesByDayRange[]> {
        return StravaTrain.aggregate<ActivitiesTrainValuesByDayRange>([
            {
                $match: this.getMatchConfig()
            },
            {
                $group: {
                    _id: {
                        d: { $dayOfMonth: "$start_date" },
                        m: { $month: "$start_date" },
                        y: { $year: "$start_date" },
                        user: '$user',
                        type: '$type'
                    },
                    doc: { $push: '$$ROOT' },
                    date: { $first: "$$CURRENT.start_date" },
                    type: { $first: "$$CURRENT.type" }
                }
            },
            {
                $sort: {
                    '_id.y': 1,
                    '_id.m': 1,
                    '_id.d': 1,
                }
            },
            {
                $project: {
                    _id: 0,
                    type: '$type',
                    date: '$date',
                    user: '$_id.user',
                    trainingValues: this.getSportTypesFieldsFromProjectPipeLine()
                }
            },
            {
                $group: {
                    _id: {
                        type: '$type',
                        user: '$user'
                    },
                    trainingsValueBySportType: { $push: '$$CURRENT' }
                }
            },
            {
                $addFields: {
                    type: "$_id.type",
                    user: '$_id.user'
                }
            },
            {
                $project: {
                    _id: 0,
                    'trainingsValueBySportType.type': 0,
                    'trainingsValueBySportType.user': 0
                }
            },
            {
                $group: {
                    _id: '$user',
                    userActivities: { $push: '$$ROOT' }
                }
            },
            {
                $project: {
                    'userActivities.user': 0
                }
            },
            {
                $project: {
                    _id: 0,
                    user: '$_id',
                    userActivities: '$userActivities',
                }
            }
        ])
    }
}

export interface ActivitiesTrainValuesByDayRange {
    user: string
    userActivities: {
        type: SportTypes,
        trainingsValueBySportType: {
            date: Date,
            trainingValues: {
                sportValueName: TrainingValues,
                value: number
            }[]
        }[]
    }[]


}

