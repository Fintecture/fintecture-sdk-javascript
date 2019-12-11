import * as crypto from 'crypto';

import * as UtilsCrypto from '../src/utils/Crypto';
import { TestConfig } from './constants/config';

const mockSignature = "QVEX1W0EGwsTWGAwdNmh1pY/p/QIaw2Owz/jRuQpvmwl+FN84+fLwZUs8Ts3BYbkON5xaVv3UA/eqO+6JfOfCg4IUSMNzgDK0Ibpy02eqz8WMtSUHjto9D35RbzqxbBhL/UNK0igqkv+fqxzBYsjEJi5UQX1CXyV+Bn6vHQCkLqqYiitxWy8BtdJ+W2YChb74eyhZzmdGfTfwUO5H3OlhSGcRubclkO+yeL6gIr/XWGIfuT9jtK2UYzLffLelIDc9mxBFuhXdl+3iddm/YkYb2pxayZKgXtnzRYsiz1GhlWoMcbNdToNauGuIe0aeYAX77BlLY4P4IT7got224sLig==";
const payload = {payment: 'payment'};


describe('Crypto', function () {
    
    it('#signPayload(payload, privateKey, algorithm) with all parameters', function () {
        const algorithm = 'rsa-sha256';
        const payloadStr = JSON.stringify(payload);

        const signature = UtilsCrypto.signPayload(payloadStr, TestConfig.app_priv_key_merchant, algorithm);

        expect(signature).toEqual(mockSignature);
    });

    it('#signPayload(payload, privateKey, algorithm) without algorithm', function () {
        const algorithm = null;
        const payloadStr = JSON.stringify(payload);

        const signature = UtilsCrypto.signPayload(payloadStr, TestConfig.app_priv_key_merchant, algorithm);

        expect(signature).toEqual(mockSignature);
    });

    it('#signPayload(payload, privateKey, algorithm) payload as an object', function () {
        const algorithm = 'rsa-sha256';

        const signature = UtilsCrypto.signPayload(payload, TestConfig.app_priv_key_merchant, algorithm);

        expect(signature).toEqual(mockSignature);
    });

    it('#signPayload(payload, privateKey, algorithm) invalid signature algorithm', function () {
        const algorithm = 'sha256';
        const payloadStr = JSON.stringify(payload);

        expect( () => {UtilsCrypto.signPayload(payloadStr, TestConfig.app_priv_key_merchant, algorithm)} ).toThrow(new Error("invalid signature algorithm"));
    });

    it('#signPayload(payload, privateKey, algorithm) error during signature', function () {
        const algorithm = 'rsa-sha256';

        expect( () => {UtilsCrypto.signPayload(payload, null, algorithm)} ).toThrow(new Error("error during signature"));
    });

    it('#generateUUID()', function () {
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
        let digest =  crypto.createHash('sha256').update(plainText).digest('base64');

        let key = {
            key: TestConfig.app_priv_key_merchant,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
        }
        let message = Buffer.from(digest);
        let encrypted = crypto.publicEncrypt(key, message).toString("base64");
        let decrypted = UtilsCrypto.decryptPrivate(encrypted, TestConfig.app_priv_key_merchant);

        expect(decrypted).toEqual(digest);
    });

    it('#decryptPrivate(digest, privateKey) Error', () => {
        const plainText = 'test';
        let digest =  crypto.createHash('sha256').update(plainText).digest('base64');

        let key = {
            key: TestConfig.app_priv_key_merchant,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
        }
        let message = Buffer.from(digest);
        let encrypted = crypto.publicEncrypt(key, message).toString("base64");
        
        expect( () => {UtilsCrypto.decryptPrivate(encrypted, '')} ).toThrow(new Error("an error occurred while decrypting"));
    });
});