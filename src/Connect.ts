import qs from 'qs';

import { Endpoints } from './utils/URLBuilders/Endpoints';
import { IPisSetup, IPaymentPayload, IData, IAttributes, IMeta } from './interfaces/connect/ConnectInterface';
import { IFintectureConfig } from './interfaces/ConfigInterface';
import { Constants } from './utils/Constants.js';
import { PIS } from './Pis';
import * as apiService from './services/ApiService';

export class Connect {
  public pis: PIS;
  public axiosInstance: any;
  public config: IFintectureConfig;
  public connectConfig: IPisSetup;

  constructor(config: IFintectureConfig) {
    this.pis = new PIS(config);
    this.axiosInstance = apiService.getInstance({ env: config.env, timeout: config.timeout });
    this.config = config;
  }

  /**
   * Generates a connect URL based on the AIS parameters
   *
   * @param {string} accessTOken
   * @param {payment} State
   */
  public async getAisConnect(accessToken: string, connectConfig: any) {
    this.config = this._validateConfigIntegrity(this.config);

    const queryParameters = qs.stringify({
      redirect_uri: connectConfig.redirect_uri,
      state: connectConfig.state,
    });
    const url = `${Endpoints.AISCONNECT}?${queryParameters}`;

    // Extend the headers with Connect specific headers if they are defined
    const extraHeaders = {
      'x-provider': connectConfig.provider,
      'x-psu-type': connectConfig.psu_type,
      'x-country': connectConfig.country,
      'x-language': connectConfig.language,
    };

    const headers = apiService.getHeaders('get', url, null, this.config, null, extraHeaders);

    const { data } = await this.axiosInstance.get(url, { headers });

    return {
      url: data.meta.url,
    };
  }

  /**
   * Generates a connect URL based on the PIS parameters
   *
   * @param {string} accessTOken
   * @param {payment} State
   */
  public async getPisConnect(accessToken: string, connectConfig: any) {
    this.config = this._validateConfigIntegrity(this.config);
    this.connectConfig = this._validatePisConnectConfigIntegrity(connectConfig);

    const paymentPayload: IPaymentPayload = this._buildPaymentPayload(connectConfig);

    const queryParameters = qs.stringify({
      origin_uri: connectConfig.origin_uri,
      redirect_uri: connectConfig.redirect_uri,
      state: connectConfig.state,
    });
    const url = `${Endpoints.PISCONNECT}?${queryParameters}`;

    // Extend the headers with Connect specific headers if they are defined
    const extraHeaders = {
      'x-provider': connectConfig.provider,
      'x-psu-type': connectConfig.psu_type,
      'x-country': connectConfig.country,
      'x-language': connectConfig.language,
    };

    const headers = apiService.getHeaders('post', url, accessToken, this.config, paymentPayload, extraHeaders);

    const { data } = await this.axiosInstance.post(url, paymentPayload, { headers });

    return {
      session_id: data.meta.session_id,
      url: data.meta.url,
    };
  }

  private _validatePisConnectConfigIntegrity(connectConfig: any) {
    if (!connectConfig.amount) {
      throw Error('amount not set');
    }
    if (isNaN(connectConfig.amount)) {
      throw Error('amount must be a number');
    }
    if (!(connectConfig.amount >= 0.01)) {
      throw Error('amount must be greater than 0.01');
    }
    if (!connectConfig.currency) {
      throw Error('currency not set');
    }
    if (!connectConfig.customer_full_name && this.config.env === Constants.PRODUCTIONENVIRONMENT) {
      throw Error('customer full name must be set');
    }
    if (!connectConfig.customer_email && this.config.env === Constants.PRODUCTIONENVIRONMENT) {
      throw Error('customer email must be set');
    }
    if (!connectConfig.customer_ip && this.config.env === Constants.PRODUCTIONENVIRONMENT) {
      throw Error('customer ip must be set');
    }

    return connectConfig as IPisSetup;
  }

  private _buildPaymentPayload(payment: any) {
    const attributes: IAttributes = {
      amount: payment.amount,
      currency: payment.currency,
      communication: `${payment.communication}`,
      beneficiary: payment.beneficiary,
      execution_date: payment.execution_date,
      end_to_end_id: payment.end_to_end_id,
      scheme: payment.scheme,
    };

    if (payment.debited_account_id) {
      attributes.debited_account_id = payment.debited_account_id;
      attributes.debited_account_type = payment.debited_account_type;
    }

    const meta: IMeta = {
      psu_name: payment.customer_full_name,
      psu_form: payment.customer_form,
      psu_incorporation: payment.customer_incorporation,
      psu_email: payment.customer_email,
      psu_ip: payment.customer_ip,
      psu_phone: payment.customer_phone,
      psu_address: payment.customer_address,
      expiry: payment.expiry,
    };

    const data: IData = {
      type: 'SEPA',
      attributes,
    };

    const payload: IPaymentPayload = {
      data,
      meta,
    };

    return payload;
  }

  private _validateConfigIntegrity(config) {
    if (!config.private_key) {
      throw Error('private_key must be set to use this function');
    }

    return config as IFintectureConfig;
  }
}
