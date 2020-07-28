import StravaTrain from '../../strava-train-model';
import { StravaActivitiesBodyRequest } from '../../http.models';
import { StravaStatisticsGeneratorBaseClass } from './strava-statistics-generator-base-class';
import { TrainingTypes } from './models/strava-statistics-models';

export class StravaStatisticsGenerator extends StravaStatisticsGeneratorBaseClass {

    constructor(userId: string, config: StravaActivitiesBodyRequest) {
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
                    trainingValues: this.getSportTypesFieldsFromProjectPipeLine()
                }
            },
            {
                $group: {
                    _id: '$type',
                    trainingsValueBySportType: { $push: '$$CURRENT' }
                }
            },
            {
                $addFields: { type: "$_id" }
            },
            {
                $project: {
                    _id: 0,
                    'trainingsValueBySportType.type': 0
                }
            }
        ])
    }
}

export interface ActivitiesTrainValuesByDayRange {
    type: TrainingTypes,
    trainingsValueBySportType: {
        date: Date,
        trainingValues: {
            sportValueName: TrainingTypes,
            value: number
        }[]
    }[]

}

