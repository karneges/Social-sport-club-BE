import { config } from '../config/config';
import * as mongoose from 'mongoose';

export const getExpireTokenDate = () => {
    let jwtExpireHours = config.JWT_EXPIRE
    const numberPattern = /\d+/g;
    const countTokenLiveHours = +jwtExpireHours.match(numberPattern)![0]
    // return new Date(Date.now() + countTokenLiveHours * 60 * 60 * 1000) //expiration token date
    return new Date(Date.now() + countTokenLiveHours * 1000) //expiration token date
}

export const fieldSetter = <T extends mongoose.Document>(target:T,updater:{}) => {
    for (let field in updater) {
        // @ts-ignore
        target[field] = updater[field]
    }
}
