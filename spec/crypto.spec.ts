import { generateUUID, signPayload } from '../src/utils/Crypto';

const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQCqGKukO1De7zhZj6+H0qtjTkVxwTCpvKe4eCZ0FPqri0cb2JZfXJ/DgYSF6vUp
wmJG8wVQZKjeGcjDOL5UlsuusFncCzWBQ7RKNUSesmQRMSGkVb1/3j+skZ6UtW+5u09lHNsj6tQ5
1s1SPrCBkedbNf0Tp0GbMJDyR4e9T04ZZwIDAQABAoGAFijko56+qGyN8M0RVyaRAXz++xTqHBLh
3tx4VgMtrQ+WEgCjhoTwo23KMBAuJGSYnRmoBZM3lMfTKevIkAidPExvYCdm5dYq3XToLkkLv5L2
pIIVOFMDG+KESnAFV7l2c+cnzRMW0+b6f8mR1CJzZuxVLL6Q02fvLi55/mbSYxECQQDeAw6fiIQX
GukBI4eMZZt4nscy2o12KyYner3VpoeE+Np2q+Z3pvAMd/aNzQ/W9WaI+NRfcxUJrmfPwIGm63il
AkEAxCL5HQb2bQr4ByorcMWm/hEP2MZzROV73yF41hPsRC9m66KrheO9HPTJuo3/9s5p+sqGxOlF
L0NDt4SkosjgGwJAFklyR1uZ/wPJjj611cdBcztlPdqoxssQGnh85BzCj/u3WqBpE2vjvyyvyI5k
X6zk7S0ljKtt2jny2+00VsBerQJBAJGC1Mg5Oydo5NwD6BiROrPxGo2bpTbu/fhrT8ebHkTz2epl
U9VQQSQzY1oZMVX8i1m5WUTLPz2yLJIBQVdXqhMCQBGoiuSoSjafUhV7i1cEGpb88h5NBYZzWXGZ
37sJ5QsW+sJyoNde3xH8vdXhzU7eT82D6X/scw9RZz+/6rCJ4p0=
-----END RSA PRIVATE KEY-----`;
const mockSignature = "F7BupSyiBUzTfGh8ayiQe1fjqQXqZHAOTcRTwtf0AXfPBhgmMD8l+AIsbOtJu0jbz+kQWT0fPDRkONH1RmEh5tUEyoyntEqXQlcDoaZYa4KqYdJGfTw5r38Mr2EI/1tLRI4omP2T2eqNB1o1Rcs6+201+FLPisEIhJdU0eeNT4k=";

describe('Crypto', function () {
    
    it('#signPayload(payload, privateKey, algorithm) with all parameters', function () {
        const algorithm = 'rsa-sha256';
        const payload = JSON.stringify({payment: 'payment'});

        const signature = signPayload(payload, privateKey, algorithm);

        expect(signature).toEqual(mockSignature);
    });

    it('#signPayload(payload, privateKey, algorithm) without algorithm', function () {
        const algorithm = null;
        const payload = JSON.stringify({payment: 'payment'});

        const signature = signPayload(payload, privateKey, algorithm);

        expect(signature).toEqual(mockSignature);
    });

    it('#signPayload(payload, privateKey, algorithm) payload as an object', function () {
        const algorithm = 'rsa-sha256';
        const payload = {payment: 'payment'};

        const signature = signPayload(payload, privateKey, algorithm);

        expect(signature).toEqual(mockSignature);
    });

    it('#signPayload(payload, privateKey, algorithm) invalid signature algorithm', function () {
        const algorithm = 'sha256';
        const payload = JSON.stringify({payment: 'payment'});

        expect( () => {signPayload(payload, privateKey, algorithm)} ).toThrow(new Error("invalid signature algorithm"));
    });

    it('#signPayload(payload, privateKey, algorithm) error during signature', function () {
        const algorithm = 'rsa-sha256';
        const payload = {payment: 'payment'};

        expect( () => {signPayload(payload, null, algorithm)} ).toThrow(new Error("error during signature"));
    });

    it('#generateUUID()', function () {
        const uuid = generateUUID();

        expect( uuid.length ).toEqual(32)
        expect( typeof uuid ).toEqual('string');
        
    });
});