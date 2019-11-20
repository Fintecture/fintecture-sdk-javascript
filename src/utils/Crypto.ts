import { v4 as uuidv4 } from 'uuid';
import { createSign } from 'crypto';

export function generateUUID() {
    uuidv4().replace(/-/g, '');
}

export function signPayload(payload, privateKey, algorithm) {
    if (typeof payload == 'object')
        payload = JSON.stringify(payload);

    if (!algorithm || algorithm === 'rsa-sha256') {
        try {
            let signature = createSign('RSA-SHA256');
            signature.update(payload);
            return signature.sign(privateKey);

        } catch (error) {
            throw new Error("error during signature");
        }
    }

    throw new Error("invalid signature algorithm")
}