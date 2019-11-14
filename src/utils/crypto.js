const uuidv4 = require('uuid/v4');
const crypto = require('crypto');

module.exports.generateUUID = function () {
    uuidv4().replace(/-/g, '');
}

module.exports.signPayload = function (payload, privateKey, algorithm) {
    if (typeof payload == 'object')
        body = JSON.stringify(body);

    if (!algorithm || algorithm === 'rsa-sha256') {
        try {
            let signature = crypto.createSign('RSA-SHA256');
            signature.update(payload);
            return signature.sign(privateKey);

        } catch (error) {
            throw new Error("error during signature");
        }
    }

    throw new Error("invalid signature algorithm")
}