import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

export function generateUUID() {
    return uuidv4().replace(/-/g, '');
}

export function signPayload(payload: any, privateKey: string, algorithm: string): string {
    if (typeof payload == 'object')
        payload = JSON.stringify(payload);

    if (!algorithm || algorithm === 'rsa-sha256') {
        try {
            let signature = crypto.createSign('RSA-SHA256');
            signature.update(payload);
            signature.end();
            return signature.sign(privateKey).toString('base64');
        } catch (error) {
            throw new Error("error during signature");
        }
    }

    throw new Error("invalid signature algorithm")
}

export function decryptPrivate(digest: string, privateKey: string): string {
    let digestBytes = Buffer.from(digest, 'base64');
    let key = {
        'key': privateKey, //buffer
        'padding': crypto.constants.RSA_PKCS1_OAEP_PADDING
    }

    try { 
        return crypto.privateDecrypt( key, digestBytes ).toString();
    } catch (error) {
        throw new Error('an error occurred while decrypting');
    }
}

export function hashBase64(plainText: string): string {
    return crypto.createHash('sha256').update(plainText).digest('base64');
}