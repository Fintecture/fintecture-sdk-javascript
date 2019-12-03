import * as crypto from 'crypto';

import * as UtilsCrypto from '../src/utils/Crypto';

const privateKey: string = process.env.app_private_key || `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCeEocGuXp9AA+H
/8o2exRRkCsU49h8COUuCtjHJgEL4Wz9mKb1tZ7w9yzBYZ+vyOSMbMFocvIHZQac
up1cYX6+5J/XcH8QDJRqfq/dr//3xMwYH+xFBVL8R6C6Hoie3sow4x1k+ihOIZ+Q
MOoDTR+dSPnWrYjzKLa6rESJHlBrzQ5Qgq8KnwmiInkTMZq1fyOY0fBTdJuikr7/
xEnQBl44P/gqQzEeiS6kOswoXVn5DhQUSyQSMfTmrhuswnc/Ud5faBbQz1ZegsNc
eY6S6/b89lI4vcj6SCubuDWUEIVongvijF14p/y/UIU0y1JtQsK/5tmtSNboCnNN
kuKA079zAgMBAAECggEAI14i3xLOALzsPLIzROhZ/fvjX8uxCuOUn64mnbx3nHhm
QgGPTcfC1ciAN46Hw7WPyYml5qBdXeExTw0EG4Dm8oBF8VbG30jpRkCtSc1Q2Nes
ELPH0hOkYzUFlc8yI1XW6IRQdeDw9rZYNNN08KMncTI8UFfInhtccz0LIqDpPo0r
T/LVe3hN6tyW48VThMhTbf7vOGg1+fxABu8uoKFFq8bs/rp5b3Cu/8nfyNksEaTg
kz8z5dWTS0BCTMBPjgWMRXiRghWkYwQX84EVjapuPQnsEaH8zKOemITviBlO6wfh
iD2wyVwNfLTwaBiixzxh3uZGti0wq4Hg0g/31MAWDQKBgQDRlH+Mr+5zzIuSBOKj
MvIqNli9W2n7yKzpGjQTTG4V2EOwE2vxY3fbB4oxNVRNa4B44YM19P7B7gwLiWnO
eEuC95pS+vYNcYvCUyAxBEBlBTKKV7VMuavPjNkLgQH9F4Dj/reKsXcqbOzxR/5n
VjNYgaNWXb4fUYNrqyUuWV0bTQKBgQDBFXdSC4maU7MRMahkWhf/70S0917c4csx
pUut43gMpjFBDQMnXERXQudqFGPlEvzs5HMLl373SMZHiHr8WDcRwdtHMGTJOVqj
pD0XONzkP9jrwUIOKrF65VIFj005maFpAeHG5ZakIZ7WjdXQxh7j06SqoK5caJOK
rXl/qXNlvwKBgHc5RP4hr0LM37Enek5g0wZUeFLwR/BmDodk0q8P0ag3qPnncoaV
kT9WoLSxo82PFDyv/Vaakrp70vpVJ42/PSW5+V6vSX4IU/suEqgPxRoyxLeSgZ6u
GSEu/OHgd+Mklbwd0QfjQOkvofL4g68BiKAWz3Z4SYnDc0Gy0Kn3SFIZAoGBAIuk
oMVfvsc0nZ9j0KuzVQQu4fwXpC4Px0tChvdeOia704d+h7dhzbNmmcNot86m6vHR
Tzsk+BiUM4LsvDXg/wMCtzpHT70Qk/MiB2TSJT+WxaXMAaAJVI7TZ3zJ5UoxSEGP
sOCOj2JpRl1Z+zeg8hpHqSIWT8RZhcuYJvUjcmg1AoGADluBhTWky1K+QwmQE0DO
OHkL0TyG6qQ/31nnuLW5Ej1xQtuElQVWj/KZK5AJrusXSUEUzqPMR7MvMSclURyV
Mqo3BZADRlcr0AKP2TYSBCNcEBmBHCI9GfIRCPFR1eK+IciRyqjcz7kYlZ0YyfjF
r3xIiGe3JhVHqyTRE+maKu0=
-----END PRIVATE KEY-----`;
const publicKey: string = process.env.app_public_key || `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnhKHBrl6fQAPh//KNnsU
UZArFOPYfAjlLgrYxyYBC+Fs/Zim9bWe8PcswWGfr8jkjGzBaHLyB2UGnLqdXGF+
vuSf13B/EAyUan6v3a//98TMGB/sRQVS/Eeguh6Int7KMOMdZPooTiGfkDDqA00f
nUj51q2I8yi2uqxEiR5Qa80OUIKvCp8JoiJ5EzGatX8jmNHwU3SbopK+/8RJ0AZe
OD/4KkMxHokupDrMKF1Z+Q4UFEskEjH05q4brMJ3P1HeX2gW0M9WXoLDXHmOkuv2
/PZSOL3I+kgrm7g1lBCFaJ4L4oxdeKf8v1CFNMtSbULCv+bZrUjW6ApzTZLigNO/
cwIDAQAB
-----END PUBLIC KEY-----`;

const mockSignature = "QVEX1W0EGwsTWGAwdNmh1pY/p/QIaw2Owz/jRuQpvmwl+FN84+fLwZUs8Ts3BYbkON5xaVv3UA/eqO+6JfOfCg4IUSMNzgDK0Ibpy02eqz8WMtSUHjto9D35RbzqxbBhL/UNK0igqkv+fqxzBYsjEJi5UQX1CXyV+Bn6vHQCkLqqYiitxWy8BtdJ+W2YChb74eyhZzmdGfTfwUO5H3OlhSGcRubclkO+yeL6gIr/XWGIfuT9jtK2UYzLffLelIDc9mxBFuhXdl+3iddm/YkYb2pxayZKgXtnzRYsiz1GhlWoMcbNdToNauGuIe0aeYAX77BlLY4P4IT7got224sLig==";
const payload = {payment: 'payment'};


describe('Crypto', function () {
    
    it('#signPayload(payload, privateKey, algorithm) with all parameters', function () {
        const algorithm = 'rsa-sha256';
        const payloadStr = JSON.stringify(payload);

        const signature = UtilsCrypto.signPayload(payloadStr, privateKey, algorithm);

        expect(signature).toEqual(mockSignature);
    });

    it('#signPayload(payload, privateKey, algorithm) without algorithm', function () {
        const algorithm = null;
        const payloadStr = JSON.stringify(payload);

        const signature = UtilsCrypto.signPayload(payloadStr, privateKey, algorithm);

        expect(signature).toEqual(mockSignature);
    });

    it('#signPayload(payload, privateKey, algorithm) payload as an object', function () {
        const algorithm = 'rsa-sha256';

        const signature = UtilsCrypto.signPayload(payload, privateKey, algorithm);

        expect(signature).toEqual(mockSignature);
    });

    it('#signPayload(payload, privateKey, algorithm) invalid signature algorithm', function () {
        const algorithm = 'sha256';
        const payloadStr = JSON.stringify(payload);

        expect( () => {UtilsCrypto.signPayload(payloadStr, privateKey, algorithm)} ).toThrow(new Error("invalid signature algorithm"));
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
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
        }
        let message = Buffer.from(digest);
        let encrypted = crypto.publicEncrypt(key, message).toString("base64");
        let decrypted = UtilsCrypto.decryptPrivate(encrypted, privateKey);

        expect(decrypted).toEqual(digest);
    });

    it('#decryptPrivate(digest, privateKey) Error', () => {
        const plainText = 'test';
        let digest =  crypto.createHash('sha256').update(plainText).digest('base64');

        let key = {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
        }
        let message = Buffer.from(digest);
        let encrypted = crypto.publicEncrypt(key, message).toString("base64");
        
        expect( () => {UtilsCrypto.decryptPrivate(encrypted, '')} ).toThrow(new Error("an error occurred while decrypting"));
    });
});