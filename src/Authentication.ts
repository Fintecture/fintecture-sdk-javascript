import qs from 'qs';
import axios from 'axios';

import { BaseUrls } from './utils/URLBuilders/BaseUrls';
import { Endpoints } from './utils/URLBuilders/Endpoints';
import * as my_axios from './services/AuthenticationService';

/**
 * Class responsible for performing authentication with Fintecture
 *
 * @export
 * @class Authentication
 */
export class Authentication {

    private appId: string; 

    /**
     * Creates an instance of Authentication.
     *
     * @param {string} appId
     */
    constructor(appId: string){
        this.appId = appId;
    }

    /**
     * The authorize endpoint is used to validate your app_id and redirect_uri
     * as indicated in the console. If successful, the endpoint redirects the
     * user to the redirect_uri and provides a code to be exchanged for the
     * access_token.
     *
     * @param {string} redirectUri
     * @param {any} state
     * @returns {Promise<object>}
     */
    async authorize(redirectUri: string, state?: any): Promise<object> {
        const queryString: string = `?${qs.stringify({
            response_type: 'code',
            app_id: this.appId,
            redirect_uri: redirectUri,
            state: state
        })}`;

        const response =  await axios.get(`${BaseUrls.FINTECTUREOAUTHURL}${Endpoints.OAUTHTOKENAUTHORIZE}${queryString}`);
        return response;
    }

    /**
     * The accesstoken API is used to exchange the code received
     * in the /authorize API for an access_token.
     *
     * @param {string} appSecret
     * @param {string} authCode (optional)
     * @returns {Promise<object>}
     */
    async accessToken(appSecret: string, authCode?: string): Promise<object> {
        let axiosInstance = this._setAxiosInstance(appSecret);
        let data: string = this._setAccessTokenData(authCode);

        const response = await axiosInstance.post(Endpoints.OAUTHACCESSTOKEN, data);

        return response.data;
    }

    /**
     * The accesstoken API is used to exchange the code received
     * in the /authorize API for an access_token.
     *
     * @param {string} appSecret
     * @param {string} refreshToken
     * @returns {Promise<object>}
     */
    async refreshToken(appSecret: string, refreshToken: string): Promise<object> {
        let axiosInstance = this._setAxiosInstance(appSecret);
        let data: string = this._setRefreshTokenData(refreshToken);

        const response = await axiosInstance.post(Endpoints.OAUTHREFRESHTOKEN, data);

        return response.data;
    }

    /**
     * This API is used to authenticate your customer to his Bank.
     * Banks can provide different ways of authentication, we implement
     * both the redirection model and the decoupled model (using the customers smartphone),
     * subject to the whether the bank has implemented them. By calling
     * this API and defining the authentication model, you will receive an
     * API to call which either redirects the customer to his bank or triggers
     * an authentication request on his smartphone's bank app.
     *
     * @param {string} accessToken
     * @param {string} providerId
     * @returns {Promise<object>}
     */
    async authenticate(accessToken: string, providerId: string): Promise<object> {
        const headers = {
            accept: 'application/json',
            authorization: `Bearer ${accessToken}`
        }

        const response =  await axios.get(`${BaseUrls.FINTECTUREOAUTHURL}/provider/${providerId}/auth`, { headers: headers });
        return response;
    }

    /**
     * Private function that returns the data necessary to make an
     * access_token query in PIS and AIS context.
     *
     * @param {string} authCode (optional)
     * @returns {string}
     */
    _setAccessTokenData(authCode?: string): string {
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
        return qs.stringify(data);
    }

    /**
     * Private function that returns the data necessary to make a
     * refresh_token query in AIS context.
     *
     * @param {string} refreshToken
     * @returns {string}
     */
    _setRefreshTokenData(refreshToken: string): string {
        return qs.stringify({
            refresh_token: refreshToken,
            grant_type: 'refresh_token'
        });
    }

    /**
     * Private function that creates an instance of authentication
     * axios. This instance of axios include all the common headers
     * params.
     *
     * @param {string} appSecret
     * @returns {axios}
     */
    _setAxiosInstance(appSecret: string) {
        const clienToken = this._setClientToken(appSecret);
        let axiosInstance =  my_axios.getInstance(clienToken);
        return axiosInstance;
    }

    /**
     * Private function that calculates the client token in order to
     * include it in the axios instance header.
     *
     * @param {string} appSecret
     * @returns {string}
     */
    _setClientToken(appSecret: string): string {
        this._checkIfParameterExists({appSecret: appSecret});
        
        return Buffer.from(this.appId + ':' + appSecret).toString('base64');
    }

    /**
     * Private function that checks if a list of parameters are included
     *
     * @param {object} parameters
     */
    _checkIfParameterExists(parameters: object): void{
        let errors: Array<string> = [];

        for( let key in parameters){
            if(!parameters[key])
                errors.push(`invalid ${key} parameter`)
        }
            
        if(errors.length) this._trowErrors(errors);
    }

    /**
     * Private function that throw a list of errors in the same error object.
     *
     * @param {Array<string>} parameters
     * @returns {Error}
     */
    _trowErrors(errors: Array<string>): Error {
        throw Error(errors.join(', '));
    }

}