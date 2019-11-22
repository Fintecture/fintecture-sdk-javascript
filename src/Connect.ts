import qs from 'qs';

import * as UtilsCrypto from './utils/Crypto.js';
import { BaseUrls } from './utils/URLBuilders/BaseUrls';
import { instance as ApiServiceAxios } from './services/ApiService';
import { State, Payload, Data, Attributes, Meta } from './interfaces/connect/ConnectInterfaces';
import { ConnectConfig } from './interfaces/connect/ConfigInterface'

export class Connect {

    public axios: any;
    public config: ConnectConfig;

    private signature_type: string;

    // constructor(app_id: string, app_secret: string, private_key: string, redirect_uri: string, origin_uri: string, state?: string, version?: string){
    constructor(config: ConnectConfig){
        this.axios = ApiServiceAxios;
        this.config = config;
        this.signature_type = 'rsa-sha256';
    }

 
    /**
     * Generates a connect URL based on the payment parameters
     * 
     * @param {payment} State 
     */
    async getConnectUrl(paymentParams: any, type: string) {

        this._validatePaymentIntegrity(paymentParams, type);

        if (!paymentParams.end_to_end_id)
            paymentParams.end_to_end_id = UtilsCrypto.generateUUID();
        
        const payload: Payload = this._buildPayload(paymentParams);

        let state: State = {
            app_id: this.config.appId,
            app_secret: this.config.appSecret,
            signature_type: this.signature_type,
            signature: this._buildSignature(payload, this.config.privateKey, this.signature_type),
            redirect_uri: this.config.redirectUri,
            origin_uri: this.config.originUri,
            state: this.config.state ? this.config.state: '',
            order_id: paymentParams.order_id,
            payload: payload,
            version: this.config.version,
        }

        return `${BaseUrls.FINTECTURECONNECTURL}/${type}?state=${Buffer.from(JSON.stringify(state)).toString('base64')}`;
    }

    verifyUrlParameters(parameters: any, privateKey: string) {

        this._validatePostPaymentIntegrity(parameters);

        const decrypted: string = UtilsCrypto.decryptPrivate(parameters.s, privateKey);

        const testString: string = qs.stringify({
            app_id: this.config.appId,
            app_secret: this.config.appSecret,
            session_id: parameters.session_id,
            status: parameters.status,
            customer_id: parameters.customer_id,
            provider: parameters.provider,
            state: parameters.state
        });

        const localDigest: string = UtilsCrypto.hashBase64(testString);

        return decrypted === localDigest;
    }


    _validatePaymentIntegrity(paymentParams: any, type: string) {
        if (!paymentParams.amount) this._trowInvalidPaymentPayload();
        if (!paymentParams.currency) this._trowInvalidPaymentPayload();
        if (!paymentParams.order_id) this._trowInvalidPaymentPayload();
        if (!paymentParams.customer_id) this._trowInvalidPaymentPayload();
        if (!paymentParams.customer_full_name) this._trowInvalidPaymentPayload();
        if (!paymentParams.customer_email) this._trowInvalidPaymentPayload();
        if (!paymentParams.customer_ip) this._trowInvalidPaymentPayload();
        if (type !== 'pis' && type !== 'ais') this._trowInvalidPaymentPayload();
    }

    _validatePostPaymentIntegrity(parameters: any) {
        if (typeof parameters != 'object') throw new Error(`invalid parameter format, the parameter must be an object instead a ${typeof parameters}`);
        if (!parameters.s) this._trowInvalidPostPaymentParameter();
        if (!parameters.state) this._trowInvalidPostPaymentParameter();
        if (!parameters.status) this._trowInvalidPostPaymentParameter();
        if (!parameters.session_id) this._trowInvalidPostPaymentParameter();
        if (!parameters.customer_id) this._trowInvalidPostPaymentParameter();
        if (!parameters.provider) this._trowInvalidPostPaymentParameter();
    }

    _trowInvalidPaymentPayload(){
        throw Error("invalid payment payload");
    }

    _trowInvalidPostPaymentParameter() {
        throw Error("invalid post payment parameter");
    }

    _buildSignature(payment: any, privateKey: string, algorithm: string): string {
        return UtilsCrypto.signPayload(payment, privateKey, algorithm);
    }

    _buildPayload(payment: any) {
        let attributes: Attributes = {
            amount: payment.amount,
            currency: payment.currency,
            communication: `${payment.order_id}`,
            end_to_end_id: payment.end_to_end_id
        }

        let meta: Meta = {
            psu_local_id: payment.customer_id,
            psu_name: payment.customer_full_name,
            psu_email: payment.customer_email,
            psu_ip: payment.customer_ip
        }

        let data: Data = {
            type: "SEPA",
            attributes: attributes,
        }

        let payload: Payload = {
            data: data,
            meta: meta
        }

        return payload;
    }

}