/**
 * Options to be passed to connect
 *
 * @interface ConnectConfig
 * @interface State
 * @interface Payload
 * @interface Data
 * @interface Attributes
 * @interface Meta
 */

export interface ConnectConfig {
  amount: number;
  currency: string;
  communication: string;
  end_to_end_id?: string;
  customer_id?: string;
  customer_full_name?: string;
  customer_email?: string;
  customer_ip?: string;
  redirect_uri: string;
  origin_uri: string;
  state?: string;
}

export interface State {
  app_id: string;
  access_token: string;
  signature_type: string;
  signature: string;
  redirect_uri: string;
  origin_uri: string;
  state: string;
  payload: Payload;
  version?: string;
  order_id?: string;
}

export interface Payload {
  data: Data;
  meta: Meta;
}

export interface Data {
  type: string;
  attributes: Attributes;
}

export interface Attributes {
  amount: number;
  currency: string;
  communication: string;
  end_to_end_id: string;
}

export interface Meta {
  psu_local_id?: string;
  psu_name?: string;
  psu_email?: string;
  psu_ip?: string;
}
