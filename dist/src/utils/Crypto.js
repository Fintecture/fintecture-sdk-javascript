"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
var crypto_1 = require("crypto");
function generateUUID() {
    uuid_1.v4().replace(/-/g, '');
}
exports.generateUUID = generateUUID;
function signPayload(payload, privateKey, algorithm) {
    if (typeof payload == 'object')
        payload = JSON.stringify(payload);
    if (!algorithm || algorithm === 'rsa-sha256') {
        try {
            var signature = crypto_1.createSign('RSA-SHA256');
            signature.update(payload);
            return signature.sign(privateKey);
        }
        catch (error) {
            throw new Error("error during signature");
        }
    }
    throw new Error("invalid signature algorithm");
}
exports.signPayload = signPayload;
//# sourceMappingURL=Crypto.js.map