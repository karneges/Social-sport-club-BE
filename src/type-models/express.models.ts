import { UserModel } from "../models/user";

export interface Params {
    [key: string ]: string
    id: string
    postId: string
}

export interface AdvancedResult {
    advancedResult: {}
}

export interface AddUserToRequest {
    user: UserModel
}
