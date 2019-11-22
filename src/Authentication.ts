import qs from 'qs';

import { BaseUrls } from './utils/URLBuilders/BaseUrls';
import { Endpoints } from './utils/URLBuilders/Endpoints';
import * as axios from './services/AuthenticationService';

export class Authentication {

    private appId: string; 

    constructor(appId: string){
        this.appId = appId;
    }

    async getAuthorizeUrl(redirectUri: string, state: any): Promise<string> {
        const queryString: string = `?${qs.stringify({
            app_id: this.appId,
            redirect_uri: redirectUri,
            state: state
        })}`;

        return `${BaseUrls.FINTECTUREOAUTHURL}${Endpoints.OAUTHTOKENAUTHORIZE}${queryString}`;
    }

    async accessToken(appSecret: string, authCode?: string): Promise<object> {
        let axiosInstance = this._setAxiosInstance(appSecret);
        let data: object = this._setAccessTokenData(authCode);

        return await axiosInstance.post(Endpoints.OAUTHACCESSTOKEN, data)
            .then( (response) => { return response.data } )
            .catch( (error) => console.log('ERROR ACCESS TOKEN', error));

    }

    async refreshToken(appSecret: string, refreshToken: string): Promise<object> {
        let axiosInstance = this._setAxiosInstance(appSecret);
        let data: object = this._setRefreshTokenData(refreshToken);

        return await axiosInstance.post(Endpoints.OAUTHREFRESHTOKEN, data)
            .then( (response) => { return response.data } )
            .catch( (error) => console.log('ERROR REFRESH TOKEN', error));
    }

    _setAccessTokenData(authCode?: string): object {
        let data: object = {
            scope: 'PIS',
            app_id: this.appId,
            grant_type: 'client_credentials'
        };

        if(authCode){
            data = {
                scope: 'AIS',
                code: authCode,
                grant_type: 'authorization_code'
            }
        }
        return data;
    }

    _setRefreshTokenData(refreshToken: string): object {
        return {
            refresh_token: refreshToken,
            grant_type: 'refresh_token'
        };
    }

    _setAxiosInstance(appSecret: string) {
        const clienToken = this._setClientToken(appSecret);
        let axiosInstance =  axios.getInstance(clienToken);
        return axiosInstance;
    }

    _setClientToken(appSecret: string): string {
        this._checkIfParameterExists({appSecret: appSecret});
        
        return Buffer.from(this.appId + ':' + appSecret).toString('base64');
    }

    _checkIfParameterExists(parameters: object): void{
        let errors: Array<string> = [];

        for( let key in parameters){
            if(!parameters[key])
                errors.push(`invalid ${key} parameter`)
        }
            
        if(errors.length) this._trowErrors(errors);
    }

    _trowErrors(errors: Array<string>): Error {
        throw Error(errors.join(', '));
    }

}