import qs from 'qs';

import { Endpoints } from './utils/URLBuilders/Endpoints';
import { Config } from './interfaces/ConfigInterface';
import * as apiService from './services/ApiService';

/**
 * Class responsible for performing AIS calls in Fintecture API.
 *
 * @export
 * @class Ais
 */
export class AIS {

    private axiosInstance;
    private accessToken: string;
    private config: Config;

    /**
     * Creates an instance of Ais.
     */
    constructor(config: Config) {
        this.axiosInstance = this._getAxiosInstance(config.env);
        this.config = config;
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
    async authorize(accessToken: string, providerId: string, redirectUri: string): Promise<object> {
        
        if (accessToken)
            return await this._authorizeWithAccesToken(accessToken, providerId, redirectUri);
        else
            return await this._authorizeWithAppId(providerId, redirectUri);
    }

    async _authorizeWithAccesToken(accessToken: string, providerId: string, redirectUri: string): Promise<object> {
        const headers = {
            accept: 'application/json',
            authorization: `Bearer ${accessToken}`
        }

        const queryParameters = {
            redirect_uri: redirectUri
        }

        const response = await this.axiosInstance.get(`/provider/${providerId}/authorize?` + qs.stringify(queryParameters), { headers: headers });
        return response.data;
    }

    async _authorizeWithAppId(providerId: string, redirectUri: string): Promise<object> {
        const headers = {
            accept: 'application/json',
            app_id: `${this.config.app_id}`
        }

        const queryParameters = {
            response_type: 'code',
            redirect_uri: redirectUri
        }

        const response = await this.axiosInstance.get(`/ais/v1/provider/${providerId}/authorize?` + qs.stringify(queryParameters), { headers: headers });
        return response.data;
    }

    /**
     * This endpoint returns all information regarding the customer's account(s)
     *
     * @param {string} accessToken
     * @param {string} customerId
     * @param {object} queryParameters (optional)
     * @returns {Promise<object>}
     */
    async getAccounts(accessToken: string, customerId: string, queryParameters?: object): Promise<object> {
        const headers = {
            accept: 'application/json',
            authorization: `Bearer ${accessToken}`
        }

        //this.axiosInstance.default.headers.push({ Authorization: `Bearer ${accessToken}` });

        return await this.axiosInstance.get(`${Endpoints.AISCUSTOMER}/${customerId}/accounts${(queryParameters ? '?' + qs.stringify(queryParameters) : '')}`, { headers: headers })
            .then((response) => { return response.data; })
    }

    /**
     * This endpoint lists all transactions on the given account
     *
     * @param {string} accessToken
     * @param {string} customerId
     * @param {string} accountId
     * @param {object} queryParameters (optional)
     * @returns {Promise<object>}
     */
    async getTransactions(accessToken: string, customerId: string, accountId: string, queryParameters?: object): Promise<object> {
        const headers = {
            accept: 'application/json',
            authorization: `Bearer ${accessToken}`
        }

        //this.axiosInstance.default.headers.push({ Authorization: `Bearer ${accessToken}` });

        return await this.axiosInstance.get(`${Endpoints.AISCUSTOMER}/${customerId}/accounts/${accountId}/transactions/${queryParameters ? '?' + qs.stringify(queryParameters) : ''}`, { headers: headers })
            .then((response) => { return response.data; })
    }

    /**
     * This endpoint retrieves all personal information of the clients such as name,
     * address and contact details for all the beneficiary owners.
     *
     * @param {string} accessToken
     * @param {string} customerId
     * @param {object} queryParameters (optional)
     * @returns {Promise<object>}
     */
    async getAccountHolders(accessToken: string, customerId: string, queryParameters: object): Promise<object> {
        const headers = {
            accept: 'application/json',
            authorization: `Bearer ${accessToken}`
        }

        //this.axiosInstance.default.headers.push({ Authorization: `Bearer ${accessToken}` });

        return await this.axiosInstance.get(`${Endpoints.AISCUSTOMER}/${customerId}/accountholders/${queryParameters ? '?' + qs.stringify(queryParameters) : ''}`, { headers: headers })
            .then((response) => { return response.data; })
    }

    /**
     * Check if we have an accessToken
     * 
     * @returns {boolean}
     */
    _hasAccessToken(): boolean {
        return !!this.accessToken;
    }

    /**
     * Get the value of accessToken
     * 
     * @returns {string | null}
     */
    _getAccessToken(): string {
        return this.accessToken;
    }

    /**
     * Private function that creates an instance of api
     * axios. This instance of axios include all the common headers
     * params.
     *
     * @param {string} appSecret
     * @returns {axios}
     */
    _getAxiosInstance(env) {
        let axiosInstance = apiService.getInstance(env);
        return axiosInstance;
    }
}