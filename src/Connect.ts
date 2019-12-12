import qs from 'qs';

import * as UtilsCrypto from './utils/Crypto.js';
import { BaseUrls } from './utils/URLBuilders/BaseUrls';
import * as connectService from './services/ConnectService';
import { ConnectConfig, State, Payload, Data, Attributes, Meta } from './interfaces/connect/ConnectInterface';
import { Config } from './interfaces/ConfigInterface'
import { Constants } from './utils/Constants.js';
import { eventNames } from 'cluster';

export class Connect {

    public axios: any;
    public config: Config;
    public connectConfig: ConnectConfig;

    private signature_type: string;

    // constructor(app_id: string, app_secret: string, private_key: string, redirect_uri: string, origin_uri: string, state?: string, version?: string){
    constructor(config: Config){
        this.axios = connectService;
        this.config = config;
        this.signature_type = 'rsa-sha256';
    }

    /**
     * Generates a connect URL based on the payment parameters
     * 
     * @param {payment} State 
     */
    async getPisConnectUrl(accessToken: string, connectConfig: any) {

        this.config = this._validateConfigIntegrity(this.config);
        this.connectConfig = this._validateConnectConfigIntegrity(connectConfig);

        if (!connectConfig.end_to_end_id)
            connectConfig.end_to_end_id = UtilsCrypto.generateUUID();
        
        const payload: Payload = this._buildPayload(connectConfig);

        let state: State = {
            app_id: this.config.app_id,
            access_token: accessToken,
            signature_type: this.signature_type,
            signature: this._buildSignature(payload, this.config.private_key, this.signature_type),
            redirect_uri: connectConfig.redirect_uri,
            origin_uri: connectConfig.origin_uri,
            state: connectConfig.state ? connectConfig.state: '',
            order_id: connectConfig.communication,
            payload: payload
        }

        let url = `${this.config.env==Constants.SANDBOXENVIRONMENT?BaseUrls.FINTECTURECONNECTURL_SBX:BaseUrls.FINTECTURECONNECTURL_PRD}/pis`

        return `${url}?state=${Buffer.from(JSON.stringify(state)).toString('base64')}`;
    }

    verifyUrlParameters(queryString: any) {

        this.config = this._validateConfigIntegrity(this.config);
        this._validatePostPaymentIntegrity(queryString);

        const decrypted: string = UtilsCrypto.decryptPrivate(queryString.s, this.config.private_key);

        const testString: string = qs.stringify({
            app_id: this.config.app_id,
            app_secret: this.config.app_secret,
            session_id: queryString.session_id,
            status: queryString.status,
            customer_id: queryString.customer_id,
            provider: queryString.provider,
            state: queryString.state
        });

        const localDigest: string = UtilsCrypto.hashBase64(testString);

        return decrypted === localDigest;
    }


    _validateConnectConfigIntegrity(connectConfig: any) {
        if (!connectConfig.amount) throw Error('amount not set');
        if (isNaN(connectConfig.amount)) throw Error('amount must be a number');
        if (!(connectConfig.amount>=1)) throw Error('amount must be greater than 1');
        if (!connectConfig.currency) throw Error('currency not set');
        if (!connectConfig.customer_id && this.config.env == Constants.PRODUCTIONENVIRONMENT) throw Error('customer identifier must be set');
        if (!connectConfig.customer_full_name && this.config.env == Constants.PRODUCTIONENVIRONMENT) throw Error('customer full name must be set');
        if (!connectConfig.customer_email && this.config.env == Constants.PRODUCTIONENVIRONMENT) throw Error('customer email must be set');
        if (!connectConfig.customer_ip && this.config.env == Constants.PRODUCTIONENVIRONMENT) throw Error('customer ip must be set');

        connectConfig.order_id = connectConfig.communication;
        
        return <ConnectConfig>connectConfig; 
    }

    _validatePostPaymentIntegrity(queryString: any) {
        if (typeof queryString != 'object') throw new Error(`invalid parameter format, the parameter must be an object instead a ${typeof queryString}`);
        if (!queryString.s) this._trowInvalidPostPaymentParameter();
        if (!queryString.status) this._trowInvalidPostPaymentParameter();
        if (!queryString.session_id) this._trowInvalidPostPaymentParameter();
        if (!queryString.customer_id) this._trowInvalidPostPaymentParameter();
        if (!queryString.provider) this._trowInvalidPostPaymentParameter();
    }

    _trowInvalidPostPaymentParameter() {
        throw Error("missing query string");
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

    _validateConfigIntegrity(config) {
        if (!config.private_key) {
            throw Error('private_key must be set to use this function');
        }

        return <Config>config;
    }

}