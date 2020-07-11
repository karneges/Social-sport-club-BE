import StravaTrain from '../strava-train-model';
import { convertArrayToObject } from '../../../../socket/utils/convert-array-to-objects';

export class StravaStatisticsGenerator {

    constructor(private userId: string, private config: StravaStatisticConfig) {
    }

    async getStatistics(): Promise<{ [p: string]: any }> {
        const statistics = await StravaTrain.aggregate([
            {
                $match: {
                    user: this.userId,
                    start_date: {
                        $gt: this.config.date.bottomBarerDate,
                        $lt: this.config.date.topBarerDate
                    }
                }
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
                    ...this.getProjectConfig()
                }
            }
        ])
        return convertArrayToObject(statistics,'_id')
    }

    getProjectConfig() {
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

}

export interface StravaStatisticConfig {
    date: {
        bottomBarerDate: Date,
        topBarerDate: Date
    },
    fields: string[]
}
