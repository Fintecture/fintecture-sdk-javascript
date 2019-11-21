import { ResourcesURLBuilder } from './utils/URLBuilders/ResourcesURLBuilder';
import { generateUUID, signPayload } from './utils/Crypto.js';
import { BaseUrls } from './utils/URLBuilders/BaseUrls';
import { instance as ApiServiceAxios } from './services/ApiService';
import { State, Payload, Data, Attributes, Meta } from './interfaces/connect/ConnectInterfaces';


export class Connect {

    public axios: any;
    public app_id: string;
    public app_secret: string;
    public private_key: string;
    public redirect_uri: string;
    public origin_uri: string;
    public state: string;
    public version: string;

    private signature_type: string;

    constructor(app_id: string, app_secret: string, private_key: string, redirect_uri: string, origin_uri: string, state?: string, version?: string){
        this.axios = ApiServiceAxios;
        this.app_id = app_id;
        this.app_secret = app_secret;
        this.private_key = private_key;
        this.signature_type = 'rsa-sha256';
        this.redirect_uri = redirect_uri;
        this.origin_uri = origin_uri;
        this.state = state;
        this.version = version;
    }

 
    /**
     * Generates a connect URL based on the payment parameters
     * 
     * @param {payment} State 
     */
    async getConnectUrl(paymentParams: any, type: string) {

        this._validatePaymentIntegrity(paymentParams, type);

        if (!paymentParams.end_to_end_id)
            paymentParams.end_to_end_id = generateUUID();
        
        const payload: Payload = this._buildPayload(paymentParams);

        let state: State = {
            app_id: this.app_id,
            app_secret: this.app_secret,
            signature_type: this.signature_type,
            signature: this._buildSignature(payload, this.private_key, this.signature_type),
            redirect_uri: this.redirect_uri,
            origin_uri: this.origin_uri,
            state: this.state ? this.state: '',
            order_id: paymentParams.order_id,
            payload: payload,
            version: this.version,
        }

        return `${BaseUrls.FINTECTURECONNECTURL}/${type}?state=${Buffer.from(JSON.stringify(state)).toString('base64')}`;
    }

    // async verifyUrlParameters(digest: string) {
    // }


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

    _trowInvalidPaymentPayload(){
        throw Error("invalid payment payload");
    }

    _buildSignature(payment: any, privateKey: string, algorithm: string): string {
        return signPayload(payment, privateKey, algorithm);
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