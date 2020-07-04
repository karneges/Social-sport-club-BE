import { UserModel } from "../models/user";

export interface BaseParamsInterface {
    [key: string]: any
}

export interface Params extends BaseParamsInterface {
    id: string
    eventId: string
    postId: string,
    limit: string
    page: string
    userId: string
}

export interface Query {
    limit: string
    page: string
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
