import { ISessionPayload } from '../pis/PisInterface';

/**
 * Options to be passed to connect
 *
 * @interface IPisSetup
 * @interface IPisConnectConfig
 * @interface IPaymentPayload
 * @interface IData
 * @interface IAttributes
 * @interface IMeta
 */

export interface IPisSetup {
    amount: number;
    currency: string;
    communication: string;
    end_to_end_id?: string;
    customer_full_name?: string;
    customer_email?: string;
    customer_ip?: string;
    redirect_uri?: string;
    origin_uri?: string;
    state?: string;
}

export interface IAisSetup {
    redirect_uri: string;
    origin_uri?: string;
    state?: string;
}

export interface IPisConnectConfig {
    app_id: string;
    access_token: string;
    signature_type: string;
    signature: string;
    redirect_uri?: string;
    origin_uri?: string;
    state: string;
    payload: ISessionPayload;
    psu_type?: string;
    country?: string;
    date: string;
    request_id: string;
    provider?: string;
}

export interface IAisConnectConfig {
    app_id: string;
    access_token?: string;
    signature_type: string;
    signature: string;
    date: string;
    request_id: string;
    redirect_uri: string;
    origin_uri?: string;
    state?: string;
    psu_type?: string;
    country?: string;
    provider?: string;
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
    amount: string;
    currency: string;
    communication: string;
    execution_date?: string;
    beneficiary?: IBeneficiary;
    end_to_end_id?: string;
    scheme?: string;
    debited_account_id?: string;
    debited_account_type?: string;
}

export interface IMeta {
    psu_local_id?: string;
    psu_name?: string;
    psu_form?: string;
    psu_incorporation?: string;
    psu_email?: string;
    psu_phone?: string;
    psu_ip?: string;
    psu_address?: IAddress;
    expiry?: string | number;
}

export interface IAddress {
    name: string;
    street: string;
    number: string;
    city: string;
    zip: string;
    country: string;
}

export interface IBeneficiary {
    name: string;
    form?: string;
    incorporation?: string;
    street: string;
    number?: string;
    city: string;
    zip: string;
    country: string;
    iban: string;
    swift_bic: string;
    bank_name: string;
}

export interface IPisConnect {
    url: string;
    session_id: string;
}

export interface IAisConnect {
    url: string;
}
