import { BaseParamsInterface } from '../../../type-models/express.models';
import { TrainingValues } from './utils-classes/strava-statistics-generator/models/strava-statistics-models';

export interface StravaAuthParams extends BaseParamsInterface {
    code: string
}

export interface StravaActivitiesBodyRequest {
    bottomBarerDate: string,
    topBarerDate: string,
    secondaryUsers?:string[]
    fields: TrainingValues[]
}
