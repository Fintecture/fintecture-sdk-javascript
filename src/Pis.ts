import { Endpoints } from './utils/URLBuilders/Endpoints';
import { ISessionPayload } from './interfaces/pis/PisInterface';
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
  private config: IConfig;

  /**
   * Creates an instance of PIS.
   *
   * @param {Config} config
   */
  constructor(config: IConfig) {
    this.axiosInstance = this._getAxiosInstance(config.env);
    this.config = config;
  }

  /**
   * Prepare
   *
   * @param {string} accessToken
   * @param {object} payload
   * @returns {Promise<object>}
   */
  public async prepare(
    accessToken: string,
    payload: object,
  ): Promise<object> {
    const url = `${Endpoints.PIS}/prepare`;

    const headers = apiService.getHeaders('post', url, accessToken, this.config, payload);

    const response = await this.axiosInstance.post(url, payload, { headers });
    return response.data;
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
    const url = `${Endpoints.PISPROVIDER}/${providerId}/initiate?redirect_uri=${redirectUri}${state ? '&state=' + state : ''}`;

    const headers = apiService.getHeaders('post', url, accessToken, this.config, payload);

    const response = await this.axiosInstance.post(url, payload, { headers });
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
    
    const url = `${Endpoints.PISCUSTOMER}/${customerId}/confirm`;

    const payload = this._buildSessionPayload(sessionId);
    
    const headers = apiService.getHeaders('post', url, accessToken, this.config, payload);

    const response = await this.axiosInstance.put(url, payload, { headers });

    return response.data;
  }

  /**
   * This endpoint returns the details of all transfers or of a specific transfer
   *
   * @param {string} accessToken
   * @param {string} sessionId
   * @returns {Promise<object>}
   */
  public async getPayments(accessToken: string, sessionId: string): Promise<object> {

    const url = `${Endpoints.PIS}/payments/${sessionId}`;
    
    const headers = apiService.getHeaders('get', url, accessToken, this.config);

    const response = await this.axiosInstance.get(url, {headers});

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

  private _buildSessionPayload(sessionId) {
    return {
      meta: {
        session_id: sessionId,
      },
    } as ISessionPayload;
  }
}
