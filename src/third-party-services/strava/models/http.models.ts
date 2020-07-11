import { BaseParamsInterface } from '../../../type-models/express.models';

export interface StravaAuthParams extends BaseParamsInterface {
    code: string
}

export interface StravaActivitiesBody {
    bottomBarerDate: string,
    topBarerDate: string,
    fields?: string[]
}
