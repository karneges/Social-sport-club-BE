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
                    type: 1,
                    date: 1,
                    user: '$_id.user',
                    trainingValues: this.getSportTypesFieldsFromProjectPipeLine()
                }
            },
            {
                $unwind: '$trainingValues'
            },
            {
                $project: {
                    _id: 0,
                    type: 1,
                    date: 1,
                    user: 1,
                    trainingDimensionName: '$trainingValues.trainingDimensionName',
                    'trainingValues.date': '$date',
                    'trainingValues.value': '$trainingValues.value',
                }
            },
            {
                $group: {
                    _id: {
                        type: '$type',
                        user: '$user',
                        trainingDimensionName: '$trainingDimensionName'
                    },
                    valuesByTrainingDimensionName: { $push: '$$CURRENT' }
                }
            },
            {
                $project: {
                    valuesByTrainingDimensionName: '$valuesByTrainingDimensionName.trainingValues'
                }
            },
            {
                $addFields: {
                    type: "$_id.type",
                    user: '$_id.user',
                    trainingDimensionName: '$_id.trainingDimensionName'
                }
            },
            {
                $project: {
                    _id: 0,
                    'trainingsValueBySportType.type': 0,
                    'trainingsValueBySportType.user': 0,
                    'trainingsValueBySportType.sportValueName': 0,
                }
            },
            {
                $group: {
                    _id: { type: '$type', user: '$user' },
                    userActivities: { $push: '$$CURRENT' }
                }
            },
            {
                $project: {
                    'userActivities.user': 0,
                    'userActivities.type': 0
                }
            },
            {
                $addFields: {
                    type: "$_id.type",
                    user: '$_id.user',
                }
            },
            {
                $project: {
                    userActivities: [
                        {
                            type: '$type',
                            valuesByType: '$userActivities',
                        }
                    ],
                }
            },
            {
                $unwind: '$userActivities'
            },
            {
                $sort: {'userActivities.type':1}
            },
            {
                $group: {
                    _id: '$_id.user',
                    userActivities: { $push: '$$ROOT.userActivities' },
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
        valuesByType: {
            valuesByTrainingDimensionName: { date: string, value: number }[],
            trainingDimensionName: string
        }[]
    }[]
}

