import { StravaBaseModel, StravaModel } from '../stravaModel';
import { StravaToken } from '../../utils/getTokenStatus';
import axios from 'axios';
import { StravaUrlGenerator } from './stravaUrlGenerator';
import { fieldSetter } from '../../../../utils/utils';

export class StravaTokenFactory extends StravaToken {

    constructor(private stravaEntity: StravaModel) {
        super(stravaEntity)
    }

    async getToken(): Promise<string> {
        if (!this.accessToken) {
            return await axios
                .post<StravaBaseModel>(new StravaUrlGenerator(this.refreshToken).getNewAccessTokenConfigUrl())
                .then((res) => fieldSetter(this.stravaEntity, res.data))
                .then(() => this.stravaEntity.save()
                    .then(({ access_token }) => access_token))
                .catch(e => {
                    throw new Error(e)
                })
        }
        return this.accessToken
    }

}
