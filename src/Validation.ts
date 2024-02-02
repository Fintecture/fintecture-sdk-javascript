import crypto from 'crypto';
import qs from 'qs';

import { IFintectureConfig } from './interfaces/ConfigInterface';

export class Validation {
    private config: IFintectureConfig;

    constructor(config) {
        this.config = config;
    }

    public authenticateRequest(headers: any, body: any): boolean {
        const rawBody = typeof body === 'string' ? body : qs.stringify(body);
        const expectedDigest = 'SHA-256=' + crypto.createHash('sha256').update(rawBody).digest('base64');

        // Validate the digest
        if (headers.digest !== expectedDigest) {
            throw new Error('Digest mistmatch');
        }

        const signatureComponents = this.extractSignatureComponents(headers.signature);

        // Check that the supplied keyId is matching the app_id supplied to the SDK
        if (this.config.app_id !== signatureComponents.get('keyId')) {
            throw new Error('The value of keyId is unknown. It should match the value of app_id');
        }

        // Validate the signature
        const signatureHeaders = signatureComponents.get('headers');

        if (signatureHeaders.includes('(request-target)')) {
            headers['(request-target)'] = 'post /webhook';
        }

        const actualPayload = signatureHeaders
            .toLocaleLowerCase()
            .split(' ')
            .map((header) => `${header}: ${headers[header]}`)
            .join('\n');

        const expectedPayload = crypto
            .privateDecrypt(this.config.private_key, Buffer.from(signatureComponents.get('signature'), 'base64'))
            .toString();

        return actualPayload === expectedPayload;
    }

    private extractSignatureComponents(signature: string): Map<string, string> {
        const pattern = /([a-z]+)\s*=\s*"([^"]+)"/gi;
        const signatureComponents = new Map();

        if (!signature || !pattern.test(signature)) {
            return signatureComponents;
        }

        pattern.lastIndex = 0;

        let result = null;

        while ((result = pattern.exec(signature)) !== null) {
            signatureComponents.set(result[1], result[2]);
        }

        return signatureComponents;
    }
}
