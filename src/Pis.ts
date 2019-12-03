import { Endpoints } from './utils/URLBuilders/Endpoints';
import {instance as axiosInstance} from './services/ApiService';
import { Confirmation } from './interfaces/pis/Confirmation';

/**
 * Class responsible for performing PIS calls in Fintecture API.
 *
 * @export
 * @class Pis
 */
export class Pis {

    private axios;
    private accessToken: string;

    /**
     * Creates an instance of Pis.
     *
     * @param {string} accessToken
     */
    constructor(accessToken: string){
        this.axios = axiosInstance;
        this.accessToken = accessToken;

        this.axios.defaults.headers['Content-Type'] = 'application/json' ;
        this.axios.defaults.headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    /**
     * Initiate
     *
     * @param {string} providerId
     * @param {object} payload
     * @param {string} redirectUri
     * @param {string} state (optional)
     * @returns {Promise<object>}
     */
    async initiate(providerId: string, payload: object, redirectUri: string, state?: string): Promise<object> {
        const response = await this.axios.post(`${Endpoints.PISPROVIDER}/${providerId}/initiate?redirect_uri=${redirectUri}${state?'&state='+state:''}`, payload);
        return response.data;
    }

    /**
     * Confirm
     *
     * @param {string} customerId
     * @param {Confirmation} resource
     * @returns {Promise<object>}
     */
    async putConfirm(customerId: string, resource: Confirmation): Promise<object> {
        const response =  await this.axios.put(`${Endpoints.PISCUSTOMER}/${customerId}/confirm`, resource);

        return response.data;
    }

    /**
     * This endpoint returns the details of all transfers or of a specific transfer
     *
     * @param {string} customerId
     * @param {string} sessionId
     * @returns {Promise<object>}
     */
    async getPayments(customerId: string, sessionId: string): Promise<object> {
        const response = await this.axios.get(`${Endpoints.PISCUSTOMER}/${customerId}/payments/${sessionId}`);

        return response.data;
    }

}