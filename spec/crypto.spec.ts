import * as UtilsCrypto from '../src/utils/Crypto';
import { TestConfig } from './constants/config';

const mockSignature = "dJcMjG/HsJoq2x/PoZ8YfFzzMFFyfWpqiDnODIOiZ5k9GqmkwrPVJ1fflZLVBD/h1dleIDFJPWAwvBj8VsWCjEEjbvujKV32EJjDFiw3CACvRbx1IYr0JtjorKsjDABlJNbj+LBSEk1YGRDbKYBqURo4CL/xMOAHlZ856kr4fkNH4rlJ9c+kq4KrvMEcZQc6EfN37p2Ap6pjLm9abwH3a+cQNjOGI07/3QY1spfj7Z89svVEHEc9XSSTcM5aE18F4C7ACtEXsGYZMUSRS7/JfE6Ma3gsnKbKUPwhsQjhmrWhsFlqpQ4mcJ+eJWj1eSA7H97QoN5MKaAtDxHYHQyVog==";
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
});