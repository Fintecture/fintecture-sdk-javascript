import qs from 'qs';
import axios from 'axios';
import dotenv from 'dotenv';
import { resolve } from 'path';

import { BaseUrls } from './utils/URLBuilders/BaseUrls';
import { Endpoints } from './utils/URLBuilders/Endpoints';
import { Config } from './interfaces/ConfigInterface';
import * as authService from './services/AuthenticationService';

dotenv.config({path: resolve(__dirname, '../.env')});

/**
 * Class responsible for performing authentication with Fintecture
 *
 * @export
 * @class Authentication
 */
export class Authentication {

    private axiosInstance;
    private appId: string; 
    private appSecret: string; 

    /**
     * Creates an instance of Authentication.
     *
     * @param {string} appId
     */
    constructor(config:Config){
        this.appId = config.app_id;
        this.appSecret = config.app_secret;
        this.axiosInstance = this._getAxiosInstance(config.env);
    }

    /**
     * The accesstoken API is used to exchange the code received
     * in the /authorize API for an access_token.
     *
     * @param {string} appSecret
     * @param {string} authCode (optional)
     * @returns {Promise<object>}
     */
    async accessToken(authCode?: string): Promise<object> {
        let data: string = this._getAccessTokenData(authCode);

        const response = await this.axiosInstance.post(Endpoints.OAUTHACCESSTOKEN, data);

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
    async refreshToken(refreshToken: string): Promise<object> {
        let data: string = this._getRefreshTokenData(refreshToken);

        const response = await this.axiosInstance.post(Endpoints.OAUTHREFRESHTOKEN, data);

        return response.data;
    }

    /**
     * Private function that returns the data necessary to make an
     * access_token query in PIS and AIS context.
     *
     * @param {string} authCode (optional)
     * @returns {string}
     */
    _getAccessTokenData(authCode?: string): string {
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
    _getRefreshTokenData(refreshToken: string): string {
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
    _getAxiosInstance(env) {
        const clienToken = this._getClientToken();
        let axiosInstance =  authService.getInstance(env, clienToken);
        return axiosInstance;
    }

    /**
     * Private function that calculates the client token in order to
     * include it in the axios instance header.
     *
     * @param {string} appSecret
     * @returns {string}
     */
    _getClientToken(): string {
        return Buffer.from(this.appId + ':' + this.appSecret).toString('base64');
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