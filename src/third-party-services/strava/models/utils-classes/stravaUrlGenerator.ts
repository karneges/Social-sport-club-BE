import { STRAVA_CONFIGS } from '../../starava.configs';

export class StravaUrlGenerator {
    private url = STRAVA_CONFIGS.oAuthUrl
    private clientId = STRAVA_CONFIGS.clientId
    private clientSecret = STRAVA_CONFIGS.client_secret
    private grantType = 'authorization_code'

    constructor(private codeOrRefreshToken: string) {
    }

    getStravaRegisterConfigUrl() {
        return `${ this.url }?client_id=${ this.clientId }&client_secret=${ this.clientSecret }&code=${ this.codeOrRefreshToken }&grant_type=${ this.grantType }`
    }

    getNewAccessTokenConfigUrl() {
        return `${ this.url }?client_id=${ this.clientId }&client_secret=${ this.clientSecret }&grant_type=refresh_token&refresh_token=${ this.codeOrRefreshToken }`
    }

}
