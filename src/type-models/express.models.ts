import { UserModel } from "../models/user";

export interface BaseParamsInterface {
    [key: string]: any
    id?: string
    limit?: string
    page?: string
    userId?: string
}

export interface Params extends BaseParamsInterface {
    eventId: string
    postId: string,
}

interface BaseQueryInterface {
    limit: string
    page: string
}
export interface Query extends BaseQueryInterface{

}
export interface StravaQuery extends BaseQueryInterface{
    code:string
}

export interface AdvancedResult {
    advancedResult: {}
}

export interface AddUserToRequest {
    user: UserModel
}

export interface AuthQuery {
    gAuth: boolean
}
