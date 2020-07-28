import { StravaActivitiesBodyRequest } from '../../http.models';
import { StravaStatisticConfig, TrainingTypes } from './models/strava-statistics-models';

export class StravaStatisticsGeneratorBaseClass {
    private sportTypes = ['Run', 'NordicSki', 'Ride']
    private maxMinAvgSum = ['max', 'min', 'avg', 'sum']
    summableFields = ['distance', 'total_elevation_gain', 'elapsed_time', 'average_watts', 'kilojoules']
    protected config: StravaStatisticConfig<Date>
    constructor(protected userId: string,
                { bottomBarerDate, topBarerDate, fields }: StravaActivitiesBodyRequest) {

        this.config = {
            date: {
                bottomBarerDate: new Date(bottomBarerDate),
                topBarerDate: new Date(topBarerDate)
            },
            fields
        }
    }
    protected getProjectConfigForSportTypesStatistics() {
        if (!this.config.fields) {
            return {
                activities: '$doc'
            }
        }
        let config = {}
        this.config.fields.forEach(fieldName => {
            config = {
                ...config,
                [fieldName]: {
                    min: { $min: `$doc.${ fieldName }` },
                    max: { $max: `$doc.${ fieldName }` },
                    sum: { $sum: `$doc.${ fieldName }` },
                    avg: { $avg: `$doc.${ fieldName }` },
                }
            }
        })
        return config
    }


    protected getProjectConfigForTrainValuesStatistics() {
        // if (!this.config.fields) {
        //     return {
        //         distance: this.getConfigForAllSportTypes('distance')
        //     }
        // }
        let config = {}
        this.config.fields.forEach(fieldName => {
            config = {
                ...config,
                [fieldName]: this.getConfigForAllSportTypes(fieldName)
            }
        })
        return { ...config, _id: 0 }
    }

    protected getConfigForAllSportTypes(sportOption: string) {
        return this.sportTypes.reduce((acc, fieldName) => {
            return {
                ...acc,
                [fieldName]: this.getSumMaxMinAvgFieldsConfigs(sportOption, fieldName)
            }
        }, {})
    }

    protected getSumMaxMinAvgFieldsConfigs(sportOption: string, fieldName: string) {
        let statConfig = {}
        this.maxMinAvgSum.forEach((statName) => {
            statConfig = {
                ...statConfig,
                [statName]: {
                    [`$${ statName }`]: {
                        $map: {
                            input: '$doc',
                            as: 'item',
                            in: {
                                $cond: [
                                    { $eq: ['$$item.type', fieldName] },
                                    `$$item.${ sportOption }`,
                                    null
                                ]
                            }
                        }
                    }
                }
            }
        })
        return statConfig
    }

    protected getSportTypesFieldsFromProjectPipeLine() {
        return this.config.fields.map<{ sportValueName: TrainingTypes, value: any }>((fieldName) => {
            if (fieldName in this.summableFields) {
                return {
                    sportValueName: fieldName,
                    value: { '$sum': `$doc.fieldName` }
                }
            }
            return {
                sportValueName: fieldName,
                value: { '$sum': `$doc.${ fieldName }` }
            }
        })

    }


    protected getMatchConfig() {
        return {
            user: this.userId,
            start_date: {
                $gt: this.config.date.bottomBarerDate,
                $lt: this.config.date.topBarerDate
            }
        }
    }
}
