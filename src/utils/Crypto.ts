import { v4 as uuidv4 } from 'uuid';
import { createSign, createPrivateKey, privateDecrypt } from 'crypto';

export function generateUUID() {
    return uuidv4().replace(/-/g, '');
}

export function signPayload(payload: any, privateKey: string, algorithm: string): string {
    if (typeof payload == 'object')
        payload = JSON.stringify(payload);

    if (!algorithm || algorithm === 'rsa-sha256') {
        try {
            let signature = createSign('RSA-SHA256');
            signature.update(payload);
            signature.end();
            return signature.sign(privateKey).toString('base64');
        } catch (error) {
            throw new Error("error during signature");
        }
    }

    throw new Error("invalid signature algorithm")
}

// export function decryptPrivate(digest: string, privateKey: string) {
//     const key = createPrivateKey(privateKey);

//     var signature = privateDecrypt(
//         {
//             'key': key, //buffer
//             'padding': Constants.RSA_NO_PADDING
//         },
//         Buffer.from(digest, 'hex')
//     ).toString().substr(192);
// }