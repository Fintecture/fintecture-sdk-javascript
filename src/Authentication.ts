import qs from 'qs';

import { Endpoints } from './utils/URLBuilders/Endpoints';
import { IFintectureConfig } from './interfaces/ConfigInterface';
import * as authService from './services/AuthenticationService';
import { AxiosInstance } from 'axios';

/**
 * Class responsible for performing authentication with Fintecture
 *
 * @export
 * @class Authentication
 */
export class Authentication {
  private axiosInstance: AxiosInstance;
  private appId: string;
  private appSecret: string;

  /**
   * Creates an instance of Authentication.
   *
   * @param {string} appId
   */
  constructor(config: IFintectureConfig) {
    this.appId = config.app_id;
    this.appSecret = config.app_secret;
    this.axiosInstance = this._getAxiosInstance(config);
  }

  /**
   * The accesstoken API is used to exchange the code received
   * in the /authorize API for an access_token.
   *
   * @param {string} appSecret
   * @param {string} authCode (optional)
   * @returns {Promise<object>}
   */
  public async accessToken(authCode?: string, scopes?: string): Promise<object> {
    const data: string = this._getAccessTokenData(authCode, scopes);

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
  public async refreshToken(refreshToken: string): Promise<object> {
    const data: string = this._getRefreshTokenData(refreshToken);

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
  private _getAccessTokenData(authCode?: string, scopes?: string): string {
    let data: object = {};

    if (authCode) {
      data = {
        scope: 'AIS',
        code: authCode,
        grant_type: 'authorization_code',
      };
    } else {
      data = {
        scope: 'PIS',
        app_id: this.appId,
        grant_type: 'client_credentials',
      };
    }

    if (scopes) {
      data['scope'] = scopes;
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
  private _getRefreshTokenData(refreshToken: string): string {
    return qs.stringify({
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    });
  }

  /**
   * Private function that creates an instance of authentication
   * axios. This instance of axios include all the common headers
   * params.
   *
   * @param {IFintectureConfig} config
   * @returns {axios}
   */
  private _getAxiosInstance(config: IFintectureConfig) {
    const clientToken = this._getClientToken();

    return authService.getInstance({ env: config.env, clientToken, timeout: config.timeout });
  }

  /**
   * Private function that calculates the client token in order to
   * include it in the axios instance header.
   *
   * @param {string} appSecret
   * @returns {string}
   */
  private _getClientToken(): string {
    return Buffer.from(this.appId + ':' + this.appSecret).toString('base64');
  }

  /**
   * Private function that throw a list of errors in the same error object.
   *
   * @param {string[]} parameters
   * @returns {Error}
   */
  private _trowErrors(errors: string[]): Error {
    throw Error(errors.join(', '));
  }
}
