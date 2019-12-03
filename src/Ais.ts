import qs from 'qs';

import { Endpoints } from './utils/URLBuilders/Endpoints';
import {instance as axiosInstance} from './services/ApiService';

/**
 * Class responsible for performing AIS calls in Fintecture API.
 *
 * @export
 * @class Ais
 */
export class Ais {

    private axios;
    private accessToken: string;

    /**
     * Creates an instance of Ais.
     */
    constructor(){
        this.axios = axiosInstance;
    }

    /**
     * This endpoint returns all information regarding the customer's account(s)
     *
     * @param {string} customerId
     * @param {object} queryParameters
     * @param {string} accountsId (optional)
     * @returns {Promise<object>}
     */
    async getAccounts(customerId: string, queryParameters: object, accountsId?: string): Promise<object> {
        this.axios.default.headers.push({ Authorization: `Bearer ${this._getAccessToken()}` });

        return await this.axios.get(`${Endpoints.AISCUSTOMER}/${customerId}${accountsId?'/accounts/'+accountsId+'/':''}${queryParameters?'?'+qs.stringify(queryParameters):''}`)
            .then((response) =>{ return response.data; })
    }

    /**
     * This endpoint lists all transactions on the given account
     *
     * @param {string} customerId
     * @param {string} accountsId
     * @param {object} queryParameters
     * @returns {Promise<object>}
     */
    async getTransactions(customerId: string, accountsId: string, queryParameters: object): Promise<object> {
        this.axios.default.headers.push({ Authorization: `Bearer ${this._getAccessToken()}` });

        return await this.axios.get(`${Endpoints.AISCUSTOMER}/${customerId}/accounts/${accountsId}/transactions/${queryParameters?'?'+qs.stringify(queryParameters):''}`)
            .then((response) =>{ return response.data; })
    }

    /**
     * This endpoint retrieves all personal information of the clients such as name,
     * address and contact details for all the beneficiary owners.
     *
     * @param {string} customerId
     * @param {object} queryParameters
     * @returns {Promise<object>}
     */
    async getAccountHolders(customerId: string, queryParameters: object): Promise<object> {
        this.axios.default.headers.push({ Authorization: `Bearer ${this._getAccessToken()}` });

        return await this.axios.get(`${Endpoints.AISCUSTOMER}/${customerId}/accountholders/${queryParameters?'?'+qs.stringify(queryParameters):''}`)
            .then((response) =>{ return response.data; })
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
}