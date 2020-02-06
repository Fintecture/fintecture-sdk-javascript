import { ISessionPayload } from '../pis/PisInterface';

/**
 * Options to be passed to connect
 *
 * @interface ISetup
 * @interface IConnectConfig
 * @interface IPaymentPayload
 * @interface IData
 * @interface IAttributes
 * @interface IMeta
 */

export interface ISetup {
  amount: number;
  currency: string;
  communication: string;
  end_to_end_id?: string;
  customer_full_name?: string;
  customer_email?: string;
  customer_ip?: string;
  redirect_uri: string;
  origin_uri: string;
  state?: string;
}

export interface IConnectConfig {
  app_id: string;
  access_token: string;
  signature_type: string;
  signature: string;
  redirect_uri: string;
  origin_uri: string;
  state: string;
  payload: ISessionPayload;
  psu_type?: string;
  country?: string;
  date: string;
  request_id: string;
}

export interface IPaymentPayload {
  data: IData;
  meta: IMeta;
}

export interface IData {
  type: string;
  attributes: IAttributes;
}

export interface IAttributes {
  amount: number;
  currency: string;
  communication: string;
  end_to_end_id?: string;
}

export interface IMeta {
  psu_local_id?: string;
  psu_name?: string;
  psu_email?: string;
  psu_ip?: string;
}


export interface IConnect {
  url: string,
  session_id: string
}