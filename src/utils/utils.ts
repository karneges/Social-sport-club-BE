import { config } from '../config/config';

export const getExpireTokenDate = () => {
    let jwtExpireHours = config.JWT_EXPIRE
    const numberPattern = /\d+/g;
    const countTokenLiveHours = +jwtExpireHours.match(numberPattern)![0]
    // return new Date(Date.now() + countTokenLiveHours * 60 * 60 * 1000) //expiration token date
    return new Date(Date.now() + countTokenLiveHours * 1000) //expiration token date
}
