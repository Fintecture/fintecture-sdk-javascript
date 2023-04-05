import qs from 'qs';

import { Endpoints } from './utils/URLBuilders/Endpoints';
import { Constants } from './utils/Constants';
import { IFintectureConfig } from './interfaces/ConfigInterface';
import * as apiService from './services/ApiService';

/**
 * Class responsible for performing AIS calls in Fintecture API.
 *
 * @export
 * @class Ais
 */
export class AIS {
  private axiosInstance;
  private config: IFintectureConfig;

  /**
   * Creates an instance of Ais.
   */
  constructor(config: IFintectureConfig) {
    this.axiosInstance = this._getAxiosInstance(config);
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
    model?: string,
    psuId?: string,
    psuIpAddress?: string,
  ): Promise<object> {
    if (accessToken) {
      return await this._authorizeWithAccessToken(
        accessToken,
        providerId,
        redirectUri,
        state,
        model,
        psuId,
        psuIpAddress,
      );
    } else {
      return await this._authorizeWithAppId(providerId, redirectUri, state, model, psuId, psuIpAddress);
    }
  }

  /**
   * This API is used to poll the authentication status within
   * the decoupled model. Once the decoupled authentication flow
   * as initiated, the status is "PENDING". Once the PSU has
   * successfully authenticated, the status becomes "COMPLETED".
   * If the authentication times out, is cancelled or failed,
   * the status becomes "FAILED".
   *
   * @param {string} accessToken
   * @param {string} providerId
   *  @param {string} pollingId
   * @returns {Promise<object>}
   */
  public async decoupled(accessToken: string, providerId: string, pollingId: string): Promise<object> {
    if (accessToken) {
      return await this._decoupledWithAccesToken(accessToken, providerId, pollingId);
    } else {
      return await this._decoupledWithAppId(providerId, pollingId);
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
  public async getAccounts(
    accessToken: string,
    customerId: string,
    queryParameters?: object,
    headerParameters?: object,
  ): Promise<object> {
    const url = `${Endpoints.AISCUSTOMER}/${customerId}/accounts${
      queryParameters ? '?' + qs.stringify(queryParameters) : ''
    }`;

    const headers = apiService.getHeaders('get', url, accessToken, this.config, null, headerParameters);

    return await this.axiosInstance.get(url, { headers }).then(response => {
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
   * @param {object} headerParameters (optional)
   * @param {string} paginationUrl (optional)
   * @returns {Promise<object>}
   */
  public async getTransactions(
    accessToken: string,
    customerId: string,
    accountId: string,
    queryParameters?: object,
    headerParameters?: object,
    paginationUrl?: string,
  ): Promise<object> {
    let url = paginationUrl;

    if (!url) {
      url = `${Endpoints.AISCUSTOMER}/${customerId}/accounts/${accountId}/transactions${
        queryParameters ? '?' + qs.stringify(queryParameters) : ''
      }`;
    }

    const headers = apiService.getHeaders('get', url, accessToken, this.config, null, headerParameters);

    return await this.axiosInstance.get(url, { headers }).then(response => {
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
  public async getAccountHolders(
    accessToken: string,
    customerId: string,
    queryParameters: object,
    headerParameters?: object,
  ): Promise<object> {
    const url = `${Endpoints.AISCUSTOMER}/${customerId}/accountholders${
      queryParameters ? '?' + qs.stringify(queryParameters) : ''
    }`;

    const headers = apiService.getHeaders('get', url, accessToken, this.config, null, headerParameters);

    return await this.axiosInstance.get(url, { headers }).then(response => {
      return response.data;
    });
  }

  /**
   * This endpoint deletes all the accounts data of a given customer
   *
   * @param {string} accessToken
   * @param {string} customerId
   * @returns {Promise<object>}
   */
  public async deleteCustomer(accessToken: string, customerId: string): Promise<object> {
    const url = `${Endpoints.AISCUSTOMER}/${customerId}`;

    const headers = apiService.getHeaders('delete', url, accessToken, this.config);

    return await this.axiosInstance.delete(url, { headers }).then(response => response.data);
  }

  /**
   * Private function that creates an instance of api
   * axios. This instance of axios include all the common headers
   * params.
   *
   * @param {IFintectureConfig} config
   * @returns {axios}
   */
  private _getAxiosInstance(config: IFintectureConfig) {
    return apiService.getInstance({ env: config.env, timeout: config.timeout });
  }

  private async _authorizeWithAccessToken(
    accessToken: string,
    providerId: string,
    redirectUri: string,
    state?: string,
    model?: string,
    psuId?: string,
    psuIpAddress?: string,
  ): Promise<object> {
    const queryParameters = {
      redirect_uri: redirectUri,
    };

    if (state) {
      queryParameters['state'] = state;
    }

    if (model === Constants.DECOUPLEDMODEL) {
      queryParameters['model'] = model;
    }

    const url = `${Endpoints.AISPROVIDER}/${providerId}/authorize?${qs.stringify(queryParameters)}`;

    const headers = apiService.getHeaders('get', url, accessToken, this.config);

    if (model === Constants.DECOUPLEDMODEL) {
      headers['x-psu-id'] = psuId;
      headers['x-psu-ip-address'] = psuIpAddress;
    }

    const response = await this.axiosInstance.get(url, { headers });
    return response.data;
  }

  private async _authorizeWithAppId(
    providerId: string,
    redirectUri: string,
    state?: string,
    model?: string,
    psuId?: string,
    psuIpAddress?: string,
  ): Promise<object> {
    const queryParameters = {
      response_type: 'code',
      redirect_uri: redirectUri,
    };

    if (state) {
      queryParameters['state'] = state;
    }

    if (model === Constants.DECOUPLEDMODEL) {
      queryParameters['model'] = model;
    }

    const url = `${Endpoints.AISPROVIDER}/${providerId}/authorize?${qs.stringify(queryParameters)}`;

    const headers = apiService.getHeaders('get', url, null, this.config);

    if (model === Constants.DECOUPLEDMODEL) {
      headers['x-psu-id'] = psuId;
      headers['x-psu-ip-address'] = psuIpAddress;
    }

    const response = await this.axiosInstance.get(url, { headers });
    return response.data;
  }

  private async _decoupledWithAccesToken(accessToken: string, providerId: string, pollingId: string): Promise<object> {
    const url = `${Endpoints.AISPROVIDER}/${providerId}/authorize/decoupled/${pollingId}`;

    const headers = apiService.getHeaders('get', url, accessToken, this.config);

    const response = await this.axiosInstance.get(url, { headers });
    return response.data;
  }

  private async _decoupledWithAppId(providerId: string, pollingId: string): Promise<object> {
    const url = `${Endpoints.AISPROVIDER}/${providerId}/authorize/decoupled/${pollingId}`;

    const headers = apiService.getHeaders('get', url, null, this.config);

    const response = await this.axiosInstance.get(url, { headers });
    return response.data;
  }
}
