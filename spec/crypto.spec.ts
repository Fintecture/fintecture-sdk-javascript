import * as crypto from 'crypto';

import * as UtilsCrypto from '../src/utils/Crypto';
import { TestConfig } from './constants/config';

const mockSignature = "QVEX1W0EGwsTWGAwdNmh1pY/p/QIaw2Owz/jRuQpvmwl+FN84+fLwZUs8Ts3BYbkON5xaVv3UA/eqO+6JfOfCg4IUSMNzgDK0Ibpy02eqz8WMtSUHjto9D35RbzqxbBhL/UNK0igqkv+fqxzBYsjEJi5UQX1CXyV+Bn6vHQCkLqqYiitxWy8BtdJ+W2YChb74eyhZzmdGfTfwUO5H3OlhSGcRubclkO+yeL6gIr/XWGIfuT9jtK2UYzLffLelIDc9mxBFuhXdl+3iddm/YkYb2pxayZKgXtnzRYsiz1GhlWoMcbNdToNauGuIe0aeYAX77BlLY4P4IT7got224sLig==";
const payload = {payment: 'payment'};


describe('Crypto', () => {
    
    it('#signPayload(payload, privateKey, algorithm) with all parameters', () => {
        const algorithm = 'rsa-sha256';
        const payloadStr = JSON.stringify(payload);

        const signature = UtilsCrypto.signPayload(payloadStr, TestConfig.appPrivKeyMerchant, algorithm);

        expect(signature).toEqual(mockSignature);
    });

    it('#signPayload(payload, privateKey, algorithm) without algorithm', () => {
        const algorithm = null;
        const payloadStr = JSON.stringify(payload);

        const signature = UtilsCrypto.signPayload(payloadStr, TestConfig.appPrivKeyMerchant, algorithm);

        expect(signature).toEqual(mockSignature);
    });

    it('#signPayload(payload, privateKey, algorithm) payload as an object', () => {
        const algorithm = 'rsa-sha256';

        const signature = UtilsCrypto.signPayload(payload, TestConfig.appPrivKeyMerchant, algorithm);

        expect(signature).toEqual(mockSignature);
    });

    it('#signPayload(payload, privateKey, algorithm) invalid signature algorithm', () => {
        const algorithm = 'sha256';
        const payloadStr = JSON.stringify(payload);

        expect( () => {UtilsCrypto.signPayload(payloadStr, TestConfig.appPrivKeyMerchant, algorithm)} ).toThrow(new Error("invalid signature algorithm"));
    });

    it('#signPayload(payload, privateKey, algorithm) error during signature', () => {
        const algorithm = 'rsa-sha256';

        expect( () => {UtilsCrypto.signPayload(payload, null, algorithm)} ).toThrow(new Error("error during signature"));
    });

    it('#generateUUID()', () => {
        const uuid = UtilsCrypto.generateUUID();

        expect( uuid.length ).toEqual(32)
        expect( typeof uuid ).toEqual('string');
        
    });

    it('#hashBase64(plainText)', () => {
        const mockHashed = 'n4bQgYhMfWWaL+qgxVrQFaO/TxsrC4Is0V1sFbDwCgg=';
        const hashBase64 = UtilsCrypto.hashBase64('test');

        expect(hashBase64).toEqual(mockHashed);
    });

    it('#decryptPrivate(digest, privateKey)', () => {
        const plainText = 'test';
        const digest =  crypto.createHash('sha256').update(plainText).digest('base64');

        const key = {
            key: TestConfig.appPrivKeyMerchant,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
        }
        const message = Buffer.from(digest);
        const encrypted = crypto.publicEncrypt(key, message).toString("base64");
        const decrypted = UtilsCrypto.decryptPrivate(encrypted, TestConfig.appPrivKeyMerchant);

        expect(decrypted).toEqual(digest);
    });

    it('#decryptPrivate(digest, privateKey) Error', () => {
        const plainText = 'test';
        const digest =  crypto.createHash('sha256').update(plainText).digest('base64');

        const key = {
            key: TestConfig.appPrivKeyMerchant,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
        }
        const message = Buffer.from(digest);
        const encrypted = crypto.publicEncrypt(key, message).toString("base64");
        
        expect( () => {UtilsCrypto.decryptPrivate(encrypted, '')} ).toThrow(new Error("an error occurred while decrypting"));
    });
});