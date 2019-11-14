const ResourcesURLBuilder = require('./utils/URLBuilders/ResourcesURLBuilder');
const Crypto = require('./utils/crypto');
const { FINTECTURECONNECTURL } = require('./utils/URLBuilders/baseUrls')

class Connect {
    constructor(){
        this.axios = require('./utils/apiService');
    }

    async getConnectUrl(payment) {

        this._validatePaymentIntegrity();

        if (!payment.end_to_end_id)
            payment.end_to_end_id = this._generateEndToEndId();

        let state = {
            app_id: this.app_id,
            app_secret: this.app_secret,
            signature_type: 'rsa-sha256',
            signature: this._buildSignature(payment, this.private_key, signature_type),
            redirect_uri: this.redirect_uri,
            origin_uri: this.origin_uri,
            state: this.state ? this.state: '',
            payload: this._buildPayload(payment)
        }

        return `${FINTECTURECONNECTURL}?state=${state}`;
    }

    async verifyUrlParameters() {
        return false;
    }


    _validatePaymentIntegrity() {
        let isValidPayment = true;

        if (!payment) isValidPayment = false;
        if (!payment.amount) isValidPayment = false;
        if (!payment.currency) isValidPayment = false;

        if (!isValidPayment)
            throw Error("invalid payment payload");
    }

    _generateEndToEndId() {
        return Crypto.generateUUID();
    }

    _buildSignature(payment, privateKey, algorithm) {
        return Crypto.sign(payment, privateKey, algorithm);
    }

    _buildPayload(payment) {
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

module.exports = Connect;