import qs from 'qs';

import { Endpoints } from './utils/URLBuilders/Endpoints';
import { IConfig } from './interfaces/ConfigInterface';
import * as apiService from './services/ApiService';

/**
 * Class responsible for performing AIS calls in Fintecture API.
 *
 * @export
 * @class Ais
 */
export class AIS {
  private axiosInstance;
  private config: IConfig;

  /**
   * Creates an instance of Ais.
   */
  constructor(config: IConfig) {
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
  public async authorize(
    accessToken: string,
    providerId: string,
    redirectUri: string,
    state?: string,
  ): Promise<object> {
    if (accessToken) {
      return await this._authorizeWithAccesToken(accessToken, providerId, redirectUri, state);
    } else {
      return await this._authorizeWithAppId(providerId, redirectUri, state);
    }
  }

  /**
   * This endpoint returns all information regarding the customer's account(s)
   *
   * @param {string} accessToken
   * @param {string} customerId
   * @param {object} queryParameters (optional)
   * @returns {Promise<object>}
   */
  public async getAccounts(accessToken: string, customerId: string, queryParameters?: object): Promise<object> {
    const url = `${Endpoints.AISCUSTOMER}/${customerId}/accounts`;

    const headers = apiService.getHeaders('get', url, accessToken, this.config);

    return await this.axiosInstance
      .get(`${url}${queryParameters ? '?' + qs.stringify(queryParameters) : ''}`, { headers })
      .then(response => {
        return response.data;
      });
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
  public async getTransactions(
    accessToken: string,
    customerId: string,
    accountId: string,
    queryParameters?: object,
  ): Promise<object> {
    const url = `${Endpoints.AISCUSTOMER}/${customerId}/accounts/${accountId}/transactions`;

    const headers = apiService.getHeaders('get', url, accessToken, this.config);

    return await this.axiosInstance
      .get(`${url}${queryParameters ? '?' + qs.stringify(queryParameters) : ''}`, { headers })
      .then(response => {
        return response.data;
      });
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
  public async getAccountHolders(accessToken: string, customerId: string, queryParameters: object): Promise<object> {
    const url = `${Endpoints.AISCUSTOMER}/${customerId}/accountholders`;

    const headers = apiService.getHeaders('get', url, accessToken, this.config);

    return await this.axiosInstance
      .get(
        `${Endpoints.AISCUSTOMER}/${customerId}/accountholders${
          queryParameters ? '?' + qs.stringify(queryParameters) : ''
        }`,
        { headers },
      )
      .then(response => {
        return response.data;
      });
  }

  /**
   * Private function that creates an instance of api
   * axios. This instance of axios include all the common headers
   * params.
   *
   * @param {string} appSecret
   * @returns {axios}
   */
  private _getAxiosInstance(env) {
    return apiService.getInstance(env);
  }

  private async _authorizeWithAccesToken(
    accessToken: string,
    providerId: string,
    redirectUri: string,
    state?: string,
  ): Promise<object> {
    const url = `${Endpoints.AISPROVIDER}/${providerId}/authorize?`;

    const headers = apiService.getHeaders('get', url, accessToken, this.config);

    const queryParameters = {
      redirect_uri: redirectUri,
    };

    if (state) {
      queryParameters['state'] = state;
    }

    const response = await this.axiosInstance.get(url + qs.stringify(queryParameters), { headers });
    return response.data;
  }

  private async _authorizeWithAppId(providerId: string, redirectUri: string, state?: string): Promise<object> {
    const url = `${Endpoints.AISPROVIDER}/${providerId}/authorize?`;

    const headers = apiService.getHeaders('get', url, null, this.config);

    const queryParameters = {
      response_type: 'code',
      redirect_uri: redirectUri,
    };

    if (state) {
      queryParameters['state'] = state;
    }

    const response = await this.axiosInstance.get(url + qs.stringify(queryParameters), { headers });
    return response.data;
  }
}
