import { Endpoints } from './utils/URLBuilders/Endpoints';
import { IConfirmation } from './interfaces/pis/ConfirmationInterface';
import { IConfig } from './interfaces/ConfigInterface';
import * as apiService from './services/ApiService';

/**
 * Class responsible for performing PIS calls in Fintecture API.
 *
 * @export
 * @class PIS
 */
export class PIS {
  private axiosInstance;

  /**
   * Creates an instance of PIS.
   *
   * @param {Config} config
   */
  constructor(config: IConfig) {
    this.axiosInstance = this._getAxiosInstance(config.env);
  }

  /**
   * Initiate
   *
   * @param {string} accessToken
   * @param {string} providerId
   * @param {object} payload
   * @param {string} redirectUri
   * @param {string} state (optional)
   * @returns {Promise<object>}
   */
  public async initiate(
    accessToken: string,
    providerId: string,
    payload: object,
    redirectUri: string,
    state?: string,
  ): Promise<object> {
    this.axiosInstance.defaults.headers['Content-Type'] = 'application/json';
    this.axiosInstance.defaults.headers['Authorization'] = `Bearer ${accessToken}`;

    const response = await this.axiosInstance.post(
      `${Endpoints.PISPROVIDER}/${providerId}/initiate?redirect_uri=${redirectUri}${state ? '&state=' + state : ''}`,
      payload,
    );
    return response.data;
  }

  /**
   * Confirm
   *
   * @param {string} accessToken
   * @param {string} customerId
   * @param {Confirmation} resource
   * @returns {Promise<object>}
   */
  public async confirm(accessToken: string, customerId: string, sessionId: string): Promise<object> {
    this.axiosInstance.defaults.headers['Content-Type'] = 'application/json';
    this.axiosInstance.defaults.headers['Authorization'] = `Bearer ${accessToken}`;

    const response = await this.axiosInstance.put(
      `${Endpoints.PISCUSTOMER}/${customerId}/confirm`,
      this._buildConfirmation(sessionId),
    );

    return response.data;
  }

  /**
   * This endpoint returns the details of all transfers or of a specific transfer
   *
   * @param {string} accessToken
   * @param {string} customerId
   * @param {string} sessionId
   * @returns {Promise<object>}
   */
  public async getPayments(accessToken: string, customerId: string, sessionId: string): Promise<object> {
    this.axiosInstance.defaults.headers['Authorization'] = `Bearer ${accessToken}`;

    const response = await this.axiosInstance.get(`${Endpoints.PISCUSTOMER}/${customerId}/payments/${sessionId}`);

    return response.data;
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

  private _buildConfirmation(sessionId) {
    return {
      meta: {
        session_id: sessionId,
      },
    } as IConfirmation;
  }
}
