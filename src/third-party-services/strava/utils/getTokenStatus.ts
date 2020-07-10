import moment from 'moment'
import { StravaBaseModel } from '../models/stravaModel';

export class StravaToken {
    private readonly expiresAt: moment.Moment | undefined
    private readonly _refreshToken: string
    private _accessToken: string

    constructor(token: Partial<StravaBaseModel>) {
        this.expiresAt = moment.unix(token.expires_at!)
        this._refreshToken = token.refresh_token!
        this._accessToken = token.access_token!

    }

    public static getWrappedToken(token: Partial<StravaBaseModel>) {
        return new StravaToken(token)
    }

    get accessToken(): string {
        if (moment().isBefore(this.expiresAt)) {
            return this._accessToken!
        }
        return ''
    }
    set accessToken(accessToken:string) {
        this._accessToken = accessToken
    }

    get refreshToken() {
        return this._refreshToken
    }

}
