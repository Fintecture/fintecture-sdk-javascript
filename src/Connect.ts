import { ResourcesURLBuilder } from './utils/URLBuilders/ResourcesURLBuilder';
import { generateUUID, signPayload } from './utils/Crypto.js';
import { BaseUrls } from './utils/URLBuilders/BaseUrls';
import { instance as ApiServiceAxios } from './services/ApiService';
import { State, Payload, Data, Attributes, Meta } from './interfaces/connect/ConnectInterfaces';


export class Connect {

    public axios: any;

    // public state: State;
    // public payload: Payload;
    // public data: Data;
    // public attributes: Attributes;
    // public meta: Meta;

    constructor(){
        this.axios = ApiServiceAxios;
    }

    // getParam(interfaceName: string, paramName: string) {
    //     const allowedInterfaces = ['state', 'payload', 'data', 'attributes', 'meta'];

    //     if(!allowedInterfaces.includes(interfaceName)) throw Error("invalid target");
    //     if(!this[interfaceName].keys.includes(paramName)) this._trowInvalidParam(interfaceName, paramName);
        
    //     return this[interfaceName][paramName];
    // }
 
    /**
     * Generates a connect URL based on the payment parameters
     * 
     * @param {payment} State 
     */
    async getConnectUrl(paymentParams: any) {

        this._validatePaymentIntegrity(paymentParams);

        if (!paymentParams.end_to_end_id)
        paymentParams.end_to_end_id = this._generateEndToEndId();

        let state = {
            // app_id: this.app_id,
            // app_secret: this.app_secret,
            signature_type: 'rsa-sha256',
            // signature: this._buildSignature(paymentParams, this.private_key, signature_type),
            // redirect_uri: this.redirect_uri,
            // origin_uri: this.origin_uri,
            // state: this.state ? this.state: '',
            payload: this._buildPayload(paymentParams)
        }

        return `${BaseUrls.FINTECTURECONNECTURL}?state=${state}`;
    }

    async verifyUrlParameters() {
        return false;
    }


    _validatePaymentIntegrity(paymentParams: any) {
        if (!paymentParams) this._trowInvalidPaymentPayload();
        if (!paymentParams.amount) this._trowInvalidPaymentPayload();
        if (!paymentParams.currency) this._trowInvalidPaymentPayload();
    }

    _trowInvalidPaymentPayload(){
        throw Error("invalid payment payload");
    }

    _trowInvalidParam(interfaceName: string, paramName: string){
        throw Error(`invalid ${paramName} in ${interfaceName} object`);
    }

    _generateEndToEndId() {
        return generateUUID();
    }

    _buildSignature(payment: any, privateKey: string, algorithm: string) {
        return signPayload(payment, privateKey, algorithm);
    }

    _buildPayload(payment: any) {
        let attributes = {
            amount: payment.amount,
        }

        let data = {
            type: "SEPA",
            attributes: attributes
        }

        return data;
    }

}